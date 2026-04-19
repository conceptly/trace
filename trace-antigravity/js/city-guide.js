// js/city-guide.js

document.addEventListener('DOMContentLoaded', () => {

    // ── Route mappings ────────────────────────────────────────────────────
    const routeClassMapping = {
        'Architecture':   'architecture',
        'Typography':     'typography',
        "Artist's Pick":  'artists-pick',
        'Street Art':     'street-art',
        'Art Objects':    'art-objects'
    };

    const routeColorMapping = {
        'architecture':  '#9d372e',
        'typography':    '#3a4e9a',
        'artists-pick':  '#0d7a82',
        'street-art':    '#7a3084',
        'art-objects':   '#257a48'
    };

    // ── Collect all spots from GeoJSON data files ─────────────────────────
    const allSpots = [];

    function processGeoJSON(data, defaultClass) {
        if (!data || !data.features) return;
        data.features.forEach(f => {
            if (f.geometry && f.geometry.type === 'Point') {
                const p = f.properties;
                // Skip Artist's Pick entries until a dedicated GeoJSON file is ready
                if (p.Route === "Artist's Pick" && typeof geojsonArtistsPick === 'undefined') return;
                allSpots.push({
                    name:       p.Name     || 'Unknown Spot',
                    route:      p.Route    || '',
                    routeClass: routeClassMapping[p.Route] || defaultClass,
                    desc:       p.About    || '',
                    img:        p.IMG      || '',
                    author:     p.Author   || '',
                    year:       p.Year     || '',
                    location:   p.Location || 'Toronto, ON',
                    fact:       p['Interesting Fact'] || '',
                    note:       p["Designer Note"] || p["Designer's Note"] || '',
                    coords:     f.geometry.coordinates // [lng, lat]
                });
            }
        });
    }

    if (typeof geojsonArchitecture !== 'undefined') processGeoJSON(geojsonArchitecture, 'architecture');
    if (typeof geojsonTypography   !== 'undefined') processGeoJSON(geojsonTypography,   'typography');
    if (typeof geojsonStreetart    !== 'undefined') processGeoJSON(geojsonStreetart,    'street-art');
    if (typeof geojsonStreetArt    !== 'undefined') processGeoJSON(geojsonStreetArt,    'street-art');
    if (typeof geojsonArtObjects   !== 'undefined') processGeoJSON(geojsonArtObjects,   'art-objects');
    if (typeof geojsonArtefacts    !== 'undefined') processGeoJSON(geojsonArtefacts,    'art-objects');
    // Artist's Pick: add when geojsonArtistsPick is defined
    if (typeof geojsonArtistsPick  !== 'undefined') processGeoJSON(geojsonArtistsPick,  'artists-pick');

    // ── Fisher-Yates shuffle (for random "Top Picks" default order) ───────
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Snapshot a shuffled initial order so "Top Picks" is stable until reload
    const initialSort = shuffle(allSpots);

    // ── State ─────────────────────────────────────────────────────────────
    const ITEMS_PER_PAGE = 6;
    // activeRoutes: null = show all, Set = show only those route IDs
    let activeRoutes     = null;
    let currentSort      = 'top-picks';
    let userLocation     = null;
    let showAll          = false; // whether "See more" has been clicked
    let searchQuery      = '';    // live name-filter text

    // Helper: is a given routeClass visible given current activeRoutes?
    function isRouteActive(routeClass) {
        return activeRoutes === null || activeRoutes.has(routeClass);
    }

    const catalog        = document.getElementById('gems-catalog');

    // ── Render ────────────────────────────────────────────────────────────
    function renderCatalog() {
        catalog.innerHTML = '';
        // NOTE: showAll is NOT reset here — callers that change filter/sort
        // must reset it themselves before calling renderCatalog()

        // 1. Filter by route
        let filtered = activeRoutes === null
            ? allSpots
            : allSpots.filter(s => activeRoutes.has(s.routeClass));

        // 1b. Filter by search query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s => s.name.toLowerCase().includes(q));
        }

        // 2. Sort
        let sorted;
        if (currentSort === 'a-z') {
            sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (currentSort === 'z-a') {
            sorted = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        } else if (currentSort === 'location' && userLocation) {
            sorted = [...filtered].sort((a, b) => {
                const dA = Math.hypot(a.coords[0] - userLocation[0], a.coords[1] - userLocation[1]);
                const dB = Math.hypot(b.coords[0] - userLocation[0], b.coords[1] - userLocation[1]);
                return dA - dB;
            });
        } else {
            // Top Picks — use the pre-shuffled stable order
            sorted = initialSort.filter(s => filtered.includes(s));
        }

        if (sorted.length === 0) {
            catalog.innerHTML = `<p style="padding:24px;text-align:center;font-family:'Josefin Sans',sans-serif;color:#2d4855;">This route is coming soon!</p>`;
            return;
        }

        // 3. Slice to first 6 or show all
        const visible  = showAll ? sorted : sorted.slice(0, ITEMS_PER_PAGE);
        const hasMore  = sorted.length > ITEMS_PER_PAGE;

        // 4. Render cards
        const listEl = document.createElement('div');
        listEl.className = 'gems-list';

        visible.forEach(spot => {
            const color  = routeColorMapping[spot.routeClass] || '#0d7a82';
            // Route colour at 75% opacity for the tag pill
            const tagBg  = hexToRgba(color, 0.75);

            const card = document.createElement('div');
            card.className = 'gem-item';
            card.innerHTML = `
                <div class="gem-img-container">
                    ${spot.img
                        ? `<img src="${spot.img}" class="gem-img" alt="${spot.name}" loading="lazy">`
                        : `<div class="gem-img-placeholder"></div>`}
                    <div class="gem-indicator" style="background-color:${color}"></div>
                </div>
                <div class="gem-info">
                    <p class="gem-title">${spot.name}</p>
                    <div class="gem-route-tag" style="background-color:${tagBg}">
                        <p>${spot.route}</p>
                    </div>
                    <div class="gem-desc-wrapper">
                        <p class="gem-description">${spot.desc}</p>
                    </div>
                </div>`;

            listEl.appendChild(card);

            // Wire click to open the spot drawer
            card.addEventListener('click', () => {
                if (window._cityGuideOpenSpot) window._cityGuideOpenSpot(spot);
            });
        });

        catalog.appendChild(listEl);

        // 5. "See more Gems!" footer
        const bottomEl = document.createElement('div');
        bottomEl.className = 'catalog-bottom';

        if (hasMore && !showAll) {
            bottomEl.innerHTML = `
                <button class="see-more-btn expand" id="see-more-btn">
                    <span>See more Gems!</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18L9 12L15 6"/>
                    </svg>
                </button>`;
        } else if (hasMore && showAll) {
            bottomEl.innerHTML = `
                <button class="see-more-btn collapse" id="see-less-btn">
                    <span>Collapse list</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18L9 12L15 6"/>
                    </svg>
                </button>`;
        }

        catalog.appendChild(bottomEl);

        // 6. Bind see-more / see-less
        const seeMoreBtn = document.getElementById('see-more-btn');
        const seeLessBtn = document.getElementById('see-less-btn');
        if (seeMoreBtn) {
            seeMoreBtn.addEventListener('click', () => {
                showAll = true;
                renderCatalog();
            });
        }
        if (seeLessBtn) {
            seeLessBtn.addEventListener('click', () => {
                showAll = false;
                renderCatalog();
                // Scroll back to top of list
                catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // ── Helper: hex colour → rgba ─────────────────────────────────────────
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // ── Route buttons in hamburger menu → filter catalog & close menu ────
    const menuRouteBtns = document.querySelectorAll('.mobile-menu-overlay .route-btn');
    const mobileMenu    = document.getElementById('mobileMenu');
    const hamburgerBtn  = document.querySelector('.mobile-hamburger');

    // Map route-btn class → tag data-route value (same as tag-btn data-route)
    const routeBtnClassMap = {
        'typography':   'typography',
        'art-objects':  'art-objects',
        'architecture': 'architecture',
        'street-art':   'street-art',
        'artists-pick': 'artists-pick'
    };

    menuRouteBtns.forEach(btn => {
        // Find which route this button represents
        const routeClass = Object.keys(routeBtnClassMap).find(cls => btn.classList.contains(cls));
        if (!routeClass) return;
        const routeId = routeBtnClassMap[routeClass];

        btn.addEventListener('click', () => {
            // Apply the filter (single-route from hamburger menu)
            activeRoutes = new Set([routeId]);
            showAll = false;

            // Update tag pill active state
            document.querySelectorAll('.tag-btn').forEach(t => t.classList.remove('active'));
            const matchingTag = document.querySelector(`.tag-btn[data-route="${routeId}"]`);
            if (matchingTag) matchingTag.classList.add('active');

            // Sync sidebar
            syncSidebarChecks();

            // Re-render
            if (isDesktop()) renderDesktopCatalog(); else renderCatalog();

            // Close hamburger
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('open');
        });
    });

    // ── Route tag filter ──────────────────────────────────────────────────
    const tagBtns = document.querySelectorAll('.tag-btn');
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tagBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const routeId = btn.getAttribute('data-route');
            activeRoutes = btn.classList.contains('tag-all') ? null : new Set([routeId]);
            showAll = false;   // reset expand state on filter change
            syncSidebarChecks();
            if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
        });
    });

    // ── Sort button (cycles through modes) ───────────────────────────────
    // Map each sort state → the project icon file
    const sortIconSrc = {
        'top-picks': 'assets/icons/Icon=sortCircles.svg',
        'a-z':       'assets/icons/Icon=Sort-AZ-opt2.svg',
        'z-a':       'assets/icons/Icon=Sort-ZA-opt2.svg',
        'location':  'assets/icons/Icon=location-map.svg'
    };

    const sortCycle = [
        { id: 'top-picks', name: 'Top Picks' },
        { id: 'a-z',       name: 'A–Z' },
        { id: 'z-a',       name: 'Z–A' },
        { id: 'location',  name: 'Location' }
    ];

    const sortBtn    = document.getElementById('sort-control');
    const sortLabel  = sortBtn ? sortBtn.querySelector('.sort-label') : null;
    const sortIconEl = document.getElementById('sort-icon'); // <img>

    function updateSortIcon(id) {
        if (sortIconEl && sortIconSrc[id]) {
            sortIconEl.src = sortIconSrc[id];
        }
    }

    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            const idx  = sortCycle.findIndex(s => s.id === currentSort);
            const next = sortCycle[(idx + 1) % sortCycle.length];
            currentSort = next.id;

            updateSortIcon(currentSort);

            if (currentSort === 'location' && !userLocation) {
                if (sortLabel) sortLabel.textContent = 'Sort by Location…';
                navigator.geolocation?.getCurrentPosition(
                    pos => {
                        userLocation = [pos.coords.longitude, pos.coords.latitude];
                        if (sortLabel) sortLabel.textContent = 'Sort by Location';
                        renderCatalog();
                    },
                    () => {
                        userLocation = [-79.3871, 43.6426]; // CN Tower fallback
                        if (sortLabel) sortLabel.textContent = 'Sort by Location';
                        renderCatalog();
                    }
                );
                return;
            }

            if (sortLabel) sortLabel.textContent = `Sort by ${next.name}`;
            showAll = false;   // reset expand state on sort change
            renderCatalog();
        });
    }


    // ── Spot Drawer ───────────────────────────────────────────────────────
    const spotDrawer  = document.getElementById('spot-drawer');
    const spotOverlay = document.getElementById('drawer-overlay');

    const routeColors = {
        'Architecture':   '#9d372e',
        'Typography':     '#3a4e9a',
        "Artist's Pick":  '#0d7a82',
        "Artist\u2019s Pick": '#0d7a82',
        'Street Art':     '#7a3084',
        'Art Objects':    '#257a48'
    };

    function hydrateSpotDrawer(spot) {
        const p = spot;

        // Breadcrumb route label + colour
        const currentEl = spotDrawer.querySelector('.breadcrumb-current');
        if (currentEl) {
            currentEl.textContent = p.route || '';
            const color = routeColors[p.route] || '#0d7a82';
            currentEl.style.backgroundColor = color;
        }

        // Header
        const titleEl    = spotDrawer.querySelector('.spot-title');
        const subtitleEl = spotDrawer.querySelector('.spot-subtitle');
        const locationEl = spotDrawer.querySelector('.spot-location span');
        const headerEl   = spotDrawer.querySelector('.spot-header');

        if (titleEl) titleEl.textContent = p.name || '';
        if (headerEl) headerEl.style.borderColor = routeColors[p.route] || '#0d7a82';

        if (subtitleEl) {
            subtitleEl.innerHTML = '';
            if (p.author) {
                const s = document.createElement('span');
                s.textContent = p.author;
                subtitleEl.appendChild(s);
            }
            if (p.year) {
                const s = document.createElement('span');
                s.textContent = p.year;
                subtitleEl.appendChild(s);
            }
        }
        if (locationEl) locationEl.textContent = p.location || 'Toronto, ON';

        // Hero photo
        const heroImg = spotDrawer.querySelector('.spot-hero img');
        if (heroImg) {
            heroImg.src = p.img || '';
            heroImg.alt = p.name || '';
            heroImg.style.display = p.img ? 'block' : 'none';
        }

        // About section
        const sections = spotDrawer.querySelectorAll('.spot-section');
        if (sections[0]) {
            const pEl = sections[0].querySelector('p');
            if (pEl) pEl.textContent = p.desc || 'No description available.';
            sections[0].style.display = 'flex';
        }
        // Interesting Fact
        if (sections[1]) {
            const pEl = sections[1].querySelector('p');
            if (p.fact) {
                sections[1].style.display = 'flex';
                if (pEl) pEl.textContent = p.fact;
            } else {
                sections[1].style.display = 'none';
            }
        }
        // Designer's Note
        const designerNote = spotDrawer.querySelector('.spot-designer-note');
        if (designerNote) {
            const pEl = designerNote.querySelector('p');
            if (p.note) {
                designerNote.style.display = 'flex';
                if (pEl) pEl.textContent = p.note;
                designerNote.style.borderColor = routeColors[p.route] || '#0d7a82';
            } else {
                designerNote.style.display = 'none';
            }
        }

    }

    // ── Scroll lock ──────────────────────────────────────────────────────────
    // City-guide is a normal scrolling page (height:auto). Lock the <html>
    // element when the drawer is open so the list behind doesn't scroll.
    function lockBodyScroll() {
        document.documentElement.style.overflow = 'hidden';
    }
    function unlockBodyScroll() {
        document.documentElement.style.overflow = '';
    }

    function openSpot(spot) {
        hydrateSpotDrawer(spot);
        if (spotDrawer) spotDrawer.classList.add('active');
        // DO NOT activate the overlay on mobile — it sits at z-index:1000 while the
        // spot-drawer is z-index:99 on mobile, making it invisible but fully
        // intercepting touch/scroll events above the drawer content.
        // This matches nav.js behaviour on index.html, which also skips the overlay.
        // On desktop the drawer is narrower (417px) so activate the overlay to
        // capture clicks on the dimmed area beside it.
        if (window.innerWidth >= 769 && spotOverlay) spotOverlay.classList.add('active');
        lockBodyScroll();
    }

    function closeSpot() {
        if (spotDrawer) spotDrawer.classList.remove('active');
        if (spotOverlay) spotOverlay.classList.remove('active');
        unlockBodyScroll();
    }

    // Close buttons inside the drawer
    spotDrawer?.querySelectorAll('.close-spot, .breadcrumb-root').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('breadcrumb-root')) {
                e.preventDefault(); // Prevent page reload since we're already on the city guide
            }
            closeSpot();
        });
    });
    // Overlay click closes drawer (desktop only — on mobile overlay is inactive)
    spotOverlay?.addEventListener('click', closeSpot);

    // Expose so renderCatalog can attach wiring after each re-render
    window._cityGuideOpenSpot = openSpot;

    // ── Desktop detection ────────────────────────────────────────────────
    function isDesktop() { return window.innerWidth >= 769; }

    // ── Route metadata for desktop groups ───────────────────────────────
    const routeOrder = [
        { id: 'artists-pick', label: "Artist's Pick", color: '#0d7a82' },
        { id: 'typography',   label: 'Typography',    color: '#3a4e9a' },
        { id: 'art-objects',  label: 'Art Objects',   color: '#257a48' },
        { id: 'architecture', label: 'Architecture',  color: '#9d372e' },
        { id: 'street-art',   label: 'Street Art',    color: '#7a3084' }
    ];

    // ── Desktop catalog render ───────────────────────────────────────────
    function renderDesktopCatalog() {
        catalog.innerHTML = '';

        // Base pool: apply search query first
        let basePool = allSpots;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            basePool = allSpots.filter(s => s.name.toLowerCase().includes(q));
        }

        let sorted;
        if (currentSort === 'a-z') {
            sorted = [...basePool].sort((a, b) => a.name.localeCompare(b.name));
        } else if (currentSort === 'z-a') {
            sorted = [...basePool].sort((a, b) => b.name.localeCompare(a.name));
        } else if (currentSort === 'location' && userLocation) {
            sorted = [...basePool].sort((a, b) => {
                const dA = Math.hypot(a.coords[0]-userLocation[0], a.coords[1]-userLocation[1]);
                const dB = Math.hypot(b.coords[0]-userLocation[0], b.coords[1]-userLocation[1]);
                return dA - dB;
            });
        } else {
            sorted = initialSort.filter(s => basePool.includes(s));
        }

        const routesToShow = activeRoutes === null
            ? routeOrder
            : routeOrder.filter(r => activeRoutes.has(r.id));

        let totalShown = 0;

        routesToShow.forEach(route => {
            const spots = sorted.filter(s => s.routeClass === route.id);
            if (spots.length === 0) return;
            totalShown += spots.length;

            const group = document.createElement('div');
            group.className = 'route-group';

            const header = document.createElement('div');
            header.className = 'route-group-header';
            header.innerHTML = `
                <span class="route-group-dot" style="background:${route.color};"></span>
                <span class="route-group-name">${route.label}</span>
                <span class="route-group-count">${spots.length} gem${spots.length !== 1 ? 's' : ''}</span>
            `;
            group.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'gem-grid-desktop';

            spots.forEach(spot => {
                const card = document.createElement('div');
                card.className = 'gem-card-desktop';
                card.style.setProperty('--gem-route-color', route.color);

                const thumbInner = spot.img
                    ? `<img src="${spot.img}" alt="${spot.name}" loading="lazy">`
                    : `<div class="gem-card-thumb-placeholder">◆</div>`;

                card.innerHTML = `
                    <div class="gem-card-thumb" style="background:${route.color}18;">
                        ${thumbInner}
                    </div>
                    <div class="gem-card-body">
                        <div class="gem-card-name">${spot.name}</div>
                        <div class="gem-card-location">${spot.location}</div>
                        <span class="gem-card-tag" style="background:${route.color};">${route.label}</span>
                    </div>
                `;

                card.addEventListener('click', () => openSpot(spot));
                grid.appendChild(card);
            });

            group.appendChild(grid);
            catalog.appendChild(group);
        });

        if (totalShown === 0) {
            catalog.innerHTML = `<p style="padding:32px 0;text-align:center;font-family:'Josefin Sans',sans-serif;color:#5a8a95;letter-spacing:0.05em;">No spots match &ldquo;${searchQuery}&rdquo;</p>`;
        }

        updateSidebarCounts(totalShown);
    }

    // ── Update sidebar counts ────────────────────────────────────────────
    function updateSidebarCounts(total) {
        const countEl = document.getElementById('sidebar-result-count');
        if (countEl) countEl.textContent = total;
        routeOrder.forEach(r => {
            const el = document.getElementById(`srf-count-${r.id}`);
            if (el) el.textContent = allSpots.filter(s => s.routeClass === r.id).length;
        });
        const allEl = document.getElementById('srf-count-all');
        if (allEl) allEl.textContent = allSpots.length;
    }

    // ── syncSidebarChecks: reflect activeRoutes state in sidebar UI ─────
    function syncSidebarChecks() {
        sidebarRouteBtns.forEach(btn => {
            const routeId = btn.dataset.route;
            if (routeId === 'all') {
                btn.classList.toggle('active', activeRoutes === null);
            } else {
                btn.classList.toggle('active', activeRoutes !== null && activeRoutes.has(routeId));
            }
        });
    }

    // ── Sidebar route filter buttons (multi-select) ──────────────────────
    const sidebarRouteBtns = document.querySelectorAll('.sidebar-route-btn');
    sidebarRouteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const routeId = btn.dataset.route;
            showAll = false;

            if (routeId === 'all') {
                // All Routes → clear selection (show everything)
                activeRoutes = null;
            } else {
                // Toggle individual route in the Set
                if (activeRoutes === null) {
                    // Starting from "all" — isolate just this route
                    activeRoutes = new Set([routeId]);
                } else if (activeRoutes.has(routeId)) {
                    // Already checked — uncheck it
                    activeRoutes.delete(routeId);
                    // If nothing left, go back to "all"
                    if (activeRoutes.size === 0) activeRoutes = null;
                } else {
                    // Not checked — add it
                    activeRoutes.add(routeId);
                    // If all routes are now checked, treat as "all"
                    if (activeRoutes.size === routeOrder.length) activeRoutes = null;
                }
            }

            syncSidebarChecks();

            // Sync mobile tag pills to "all" if unrestricted, else deactivate them
            document.querySelectorAll('.tag-btn').forEach(t => t.classList.remove('active'));
            if (activeRoutes === null) {
                document.querySelector('.tag-all')?.classList.add('active');
            }

            if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
        });
    });

    // ── Sidebar sort buttons ─────────────────────────────────────────────
    const sidebarSortBtns = document.querySelectorAll('.sidebar-sort-btn');
    sidebarSortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sortId = btn.dataset.sort;
            if (sortId === 'location' && !userLocation) {
                navigator.geolocation?.getCurrentPosition(
                    pos => {
                        userLocation = [pos.coords.longitude, pos.coords.latitude];
                        currentSort = 'location';
                        activateSidebarSort(btn);
                        if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
                    },
                    () => {
                        userLocation = [-79.3871, 43.6426];
                        currentSort = 'location';
                        activateSidebarSort(btn);
                        if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
                    }
                );
                return;
            }
            currentSort = sortId;
            showAll = false;
            activateSidebarSort(btn);
            updateSortIcon(currentSort);
            if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
        });
    });

    function activateSidebarSort(activeBtn) {
        sidebarSortBtns.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // ── Clear filters ────────────────────────────────────────────────────
    document.getElementById('sidebar-clear-btn')?.addEventListener('click', () => {
        activeRoutes = null; currentSort = 'top-picks'; showAll = false;
        searchQuery = ''; clearSearchInputs();
        syncSidebarChecks();
        sidebarSortBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.sidebar-sort-btn[data-sort="top-picks"]')?.classList.add('active');
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tag-all')?.classList.add('active');
        if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
    });

    // ── Responsive re-render on resize ──────────────────────────────────
    let lastWasDesktop = isDesktop();
    window.addEventListener('resize', () => {
        const nowDesktop = isDesktop();
        if (nowDesktop !== lastWasDesktop) {
            lastWasDesktop = nowDesktop;
            if (nowDesktop) renderDesktopCatalog(); else { showAll = false; renderCatalog(); }
        }
    });

    // ── Search: highlight matched text ──────────────────────────────────
    function highlightMatch(text, query) {
        if (!query) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return text.slice(0, idx) +
               `<mark class="search-highlight">${text.slice(idx, idx + query.length)}</mark>` +
               text.slice(idx + query.length);
    }

    // ── Search: autocomplete suggestions dropdown ────────────────────────
    function buildSuggestionDropdown(inputEl) {
        // Each input gets its own dropdown sibling
        let dropdown = inputEl.parentElement.querySelector('.search-suggestions');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'search-suggestions';
            inputEl.parentElement.appendChild(dropdown);
        }
        return dropdown;
    }

    function showSuggestions(inputEl, query) {
        const dropdown = buildSuggestionDropdown(inputEl);
        if (!query || query.length < 1) {
            dropdown.innerHTML = '';
            dropdown.classList.remove('visible');
            return;
        }

        const q = query.toLowerCase();
        const matches = allSpots
            .filter(s => s.name.toLowerCase().includes(q))
            .slice(0, 8); // max 8 suggestions

        if (matches.length === 0) {
            dropdown.innerHTML = `<div class="search-suggestion-empty">No spots found</div>`;
            dropdown.classList.add('visible');
            return;
        }

        dropdown.innerHTML = matches.map(s => {
            const color = routeColorMapping[s.routeClass] || '#0d7a82';
            return `<button class="search-suggestion-item" data-name="${s.name}" type="button">
                <span class="suggestion-dot" style="background:${color};"></span>
                <span class="suggestion-name">${highlightMatch(s.name, query)}</span>
                <span class="suggestion-route" style="color:${color};">${s.route}</span>
            </button>`;
        }).join('');

        dropdown.classList.add('visible');

        // Wire suggestion clicks
        dropdown.querySelectorAll('.search-suggestion-item').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Don't blur the input
                const name = btn.dataset.name;
                // Fill input & run search
                inputEl.value = name;
                searchQuery = name;
                dropdown.innerHTML = '';
                dropdown.classList.remove('visible');
                showAll = true;
                if (isDesktop()) renderDesktopCatalog(); else renderCatalog();

                // Find and open the spot
                const spot = allSpots.find(s => s.name === name);
                if (spot) setTimeout(() => openSpot(spot), 100);
            });
        });
    }

    function hideSuggestions(inputEl) {
        const dropdown = inputEl.parentElement?.querySelector('.search-suggestions');
        if (dropdown) {
            dropdown.innerHTML = '';
            dropdown.classList.remove('visible');
        }
    }

    // ── Search: keep all inputs in sync ─────────────────────────────────
    function clearSearchInputs() {
        const desktopInput = document.getElementById('search-input');
        const mobileInput  = document.getElementById('mobile-search-input');
        if (desktopInput) { desktopInput.value = ''; hideSuggestions(desktopInput); }
        if (mobileInput)  { mobileInput.value  = ''; hideSuggestions(mobileInput);  }
    }

    function wireSearchInput(inputEl) {
        if (!inputEl) return;

        inputEl.addEventListener('input', () => {
            searchQuery = inputEl.value.trim();
            showAll = false;
            showSuggestions(inputEl, searchQuery);
            if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
        });

        inputEl.addEventListener('focus', () => {
            if (inputEl.value.trim()) showSuggestions(inputEl, inputEl.value.trim());
        });

        inputEl.addEventListener('blur', () => {
            // Slight delay so mousedown on a suggestion fires first
            setTimeout(() => hideSuggestions(inputEl), 150);
        });

        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchQuery = '';
                inputEl.value = '';
                hideSuggestions(inputEl);
                showAll = false;
                if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
            }
        });
    }

    // Wire both inputs
    wireSearchInput(document.getElementById('search-input'));
    wireSearchInput(document.getElementById('mobile-search-input'));

    // ── Initial render ────────────────────────────────────────────────────
    syncSidebarChecks();
    updateSidebarCounts(allSpots.length);
    if (isDesktop()) renderDesktopCatalog(); else renderCatalog();
});
