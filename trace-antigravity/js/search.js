/**
 * search.js — Trace App
 * Hooks up the desktop (#search-input) and mobile (#mobile-search-input) search
 * bars to the live allMarkers array populated by map.js.
 *
 * Behaviour:
 *  - On Enter or 300ms debounce after typing ≥ 2 chars → search
 *  - Find all markers whose name includes the query (case-insensitive)
 *  - If found: show only the matching markers (from any route), fit the map to
 *    them and list them in a results panel; tapping a row opens that spot
 *  - Clearing the search (×, Escape or an empty input) brings back the route view
 *  - If not found: show "Don't have it yet, sorry!" toast
 */

(function () {
    'use strict';

    // ── Helpers ────────────────────────────────────────────────────────────────

    let toastTimer = null;

    function showToast(msg, type = 'error') {
        // Remove any existing toast
        const old = document.getElementById('search-toast');
        if (old) old.remove();
        clearTimeout(toastTimer);

        const toast = document.createElement('div');
        toast.id = 'search-toast';
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: type === 'error' ? 'var(--surface-4, #2d4855)' : 'var(--brand-trace, #e7e626)',
            color: type === 'error' ? '#f5f9f6' : '#0f2229',
            padding: '12px 24px',
            borderRadius: '8px',
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
            textAlign: 'center',
            maxWidth: '80vw',
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });

        toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Route label for a marker's category ('street-art' → 'Street Art')
    function routeLabel(category) {
        if (typeof routeClassNames === 'undefined') return '';
        return Object.keys(routeClassNames).find(k => routeClassNames[k] === category) || '';
    }

    function openSpot(spot) {
        allMarkers.forEach(m => m.marker.getElement().classList.remove('active'));
        spot.marker.getElement().classList.add('active');
        // On desktop the drawer covers the right of the map, so centre the spot in what's left
        const drawer = document.querySelector('.spot-drawer');
        const shift = window.innerWidth > 768 && drawer ? -drawer.offsetWidth / 2 : 0;
        map.flyTo({ center: spot.coords, zoom: 16, offset: [shift, 0], duration: 1000, essential: true });
        if (window.openSpotDrawer && typeof hydrateSpotDrawer === 'function') {
            hydrateSpotDrawer(spot);
            window.openSpotDrawer();
        }
    }

    // Panel listing every match; stays until the search is cleared
    function showResults(matches) {
        removeResults();

        const panel = document.createElement('div');
        panel.id = 'search-results';
        panel.className = 'search-results';

        const head = document.createElement('div');
        head.className = 'search-results-head';
        const title = document.createElement('span');
        title.textContent = matches.length === 1 ? '1 spot found' : `${matches.length} spots found`;
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'search-results-close';
        close.setAttribute('aria-label', 'Clear search');
        close.textContent = '×';
        close.addEventListener('click', clearSearch);
        head.append(title, close);
        panel.appendChild(head);

        const list = document.createElement('ul');
        matches.forEach(spot => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'search-result';
            const dot = document.createElement('span');
            dot.className = 'search-result-dot';
            if (typeof routeColors !== 'undefined') dot.style.backgroundColor = routeColors[routeLabel(spot.category)] || '';
            const name = document.createElement('span');
            name.className = 'search-result-name';
            name.textContent = spot.name;
            const route = document.createElement('span');
            route.className = 'search-result-route';
            route.textContent = routeLabel(spot.category);
            btn.append(dot, name, route);
            btn.addEventListener('click', () => openSpot(spot));
            const li = document.createElement('li');
            li.appendChild(btn);
            list.appendChild(li);
        });
        panel.appendChild(list);

        document.body.appendChild(panel);
    }

    function removeResults() {
        const old = document.getElementById('search-results');
        if (old) old.remove();
    }

    // Put the markers back to what the selected route shows (same rule as map.js)
    function restoreRouteView() {
        if (typeof allMarkers === 'undefined') return;
        const cat = typeof currentActiveCategoryId !== 'undefined' ? currentActiveCategoryId : null;
        allMarkers.forEach(m => {
            const el = m.marker.getElement();
            el.classList.remove('active');
            el.style.display = (!cat || cat === m.category) ? 'block' : 'none';
        });
    }

    let searchActive = false;

    function clearSearch() {
        ['search-input', 'mobile-search-input'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        removeResults();
        if (searchActive) restoreRouteView();
        searchActive = false;
    }

    // ── Core search logic ───────────────────────────────────────────────────────

    function runSearch(query) {
        query = query.trim();
        if (query.length < 2) return;

        // allMarkers is populated by map.js after 'load' event
        if (typeof allMarkers === 'undefined' || allMarkers.length === 0) {
            showToast("Map is still loading, try again in a moment!");
            return;
        }

        const q = query.toLowerCase();
        const matches = allMarkers.filter(m =>
            m.name.toLowerCase().includes(q) ||
            (m.category && m.category.toLowerCase().includes(q))
        );

        if (matches.length === 0) {
            showToast("Don't have it yet, sorry! 🗺️");
            return;
        }

        // Show only the matches, whatever route they belong to
        searchActive = true;
        allMarkers.forEach(m => {
            const el = m.marker.getElement();
            const hit = matches.includes(m);
            el.style.display = hit ? 'block' : 'none';
            el.classList.toggle('active', hit && matches.length === 1);
        });

        if (typeof map !== 'undefined') {
            if (matches.length === 1) {
                map.flyTo({ center: matches[0].coords, zoom: 15.5, duration: 1400, essential: true });
            } else {
                const bounds = new mapboxgl.LngLatBounds();
                matches.forEach(m => bounds.extend(m.coords));
                map.fitBounds(bounds, { padding: { top: 180, bottom: 80, left: 80, right: 80 }, maxZoom: 15.5, duration: 1400 });
            }
        }

        showResults(matches);
    }

    // ── Input binding ───────────────────────────────────────────────────────────

    let debounceTimer = null;

    function bindInput(input) {
        if (!input) return;

        // keydown handles Enter on hardware keyboards
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(debounceTimer);
                runSearch(input.value);
                input.blur();
            }
            if (e.key === 'Escape') {
                clearSearch();
                input.blur();
            }
        });

        // 'search' event fires when user taps Go/Search on iOS/Android virtual keyboard
        input.addEventListener('search', () => {
            clearTimeout(debounceTimer);
            runSearch(input.value);
            input.blur();
        });

        // Debounced live search while typing
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            if (input.value.trim().length >= 2) {
                debounceTimer = setTimeout(() => runSearch(input.value), 400);
            } else if (input.value.trim() === '') {
                clearSearch();
            }
        });
    }

    // ── Init ────────────────────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', () => {
        const desktopInput = document.getElementById('search-input');
        const mobileInput  = document.getElementById('mobile-search-input');
        const mobileForm   = document.getElementById('mobile-search-form');
        const mobileBar    = document.querySelector('.mobile-floating-search');

        // Bind both inputs
        bindInput(desktopInput);
        bindInput(mobileInput);

        // Picking a route replaces the search results (map.js resets the markers)
        document.addEventListener('routeFilterChange', () => {
            searchActive = false;
            clearSearch();
        });

        // Handle mobile form submit (virtual keyboard "Go" / "Search" button)
        if (mobileForm) {
            mobileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                clearTimeout(debounceTimer);
                if (mobileInput) {
                    runSearch(mobileInput.value);
                    mobileInput.blur();
                }
            });
        }

        // ── Mobile touch fix via Mapbox API ────────────────────────────────────
        // Fighting Mapbox's capture-phase window.touchstart is impossible after
        // the fact. Instead, we use the Mapbox API to temporarily disable map
        // interaction when the search input is focused, which stops Mapbox from
        // consuming the touch that brought up the keyboard.
        if (mobileInput) {
            mobileInput.addEventListener('focus', () => {
                if (typeof map !== 'undefined') {
                    map.dragPan.disable();
                    map.scrollZoom.disable();
                    map.touchZoomRotate.disable();
                    map.touchPitch && map.touchPitch.disable();
                }
            });

            mobileInput.addEventListener('blur', () => {
                if (typeof map !== 'undefined') {
                    map.dragPan.enable();
                    map.scrollZoom.enable();
                    map.touchZoomRotate.enable();
                    map.touchPitch && map.touchPitch.enable();
                }
            });
        }

        // Fallback click handler to focus the input (for browsers where touch→click works)
        const searchInner = document.querySelector('.mobile-floating-search .search-inner');
        if (searchInner && mobileInput) {
            searchInner.addEventListener('click', (e) => {
                mobileInput.focus();
            });
        }

        // Mirror typing between desktop ↔ mobile inputs
        if (desktopInput && mobileInput) {
            desktopInput.addEventListener('input', () => { mobileInput.value = desktopInput.value; });
            mobileInput.addEventListener('input',  () => { desktopInput.value = mobileInput.value; });
        }
    });

})();
