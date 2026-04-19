// Setup Mapbox GL JS map
mapboxgl.accessToken = 'pk.eyJ1IjoiZXR1YWwtY29uY2VwdGx5IiwiYSI6ImNtbHU5ZjlvbjA5MmkzanEzeGd3eHI1ajQifQ.kD3o5_-eHOmsWmBQfP7RFg';

// Map style URLs — light is the default
// CACHE NOTE: If you update either style in Mapbox Studio and the old version
// appears, increment the matching ?v= number below to force a fresh fetch.
const MAP_STYLES = {
    // Mapbox Standard lets us apply theme:faded + lightPreset:day via setConfigProperty
    street:    'mapbox://styles/mapbox/standard',
    satellite: 'mapbox://styles/etual-conceptly/cmnt68n6r009i01qtg090hkz8?v=2' // bump v= after Studio republish
};

const map = new mapboxgl.Map({
    container: 'mapbox-container',
    style: MAP_STYLES.street, // Default: light faded standard map
    center: [-79.3832, 43.6532], // Downtown Toronto
    zoom: 13.5
});

// Track active style so style.load handlers know which config to apply
let currentMapStyle = 'street';

// Apply Mapbox Standard config after the map is fully rendered (not just style.load).
// 'idle' fires after the first frame completes, guaranteeing the Standard style's
// 'basemap' slot is fully initialized — avoids race condition on cold/slow loads.
map.once('idle', () => {
    if (currentMapStyle === 'street') {
        map.setConfigProperty('basemap', 'lightPreset', 'day');
        map.setConfigProperty('basemap', 'theme', 'faded');
    }
});

// Route Color Mapping — two palettes for light vs dark basemap
// Light map: rich/muted tones readable on cream/white street backgrounds
// Dark  map: vibrant/bright tones that pop against dark teal backgrounds
const routeColorsLight = {
    'Architecture':  '#9A4520',
    'Typography':    '#2B5EA8',
    "Artist\u2019s Pick": '#0D7A82',
    'Street Art':    '#7E3090',
    'Art Objects':   '#257A48'
};

const routeColorsDark = {
    'Architecture':  '#E8713A',
    'Typography':    '#5B8EE8',
    "Artist\u2019s Pick": '#12B5C1',
    'Street Art':    '#B84FDF',
    'Art Objects':   '#3BB86B'
};

// Active palette — starts on light (default map is street)
let routeColors = { ...routeColorsLight };

const routeClassNames = {
    'Architecture':  'architecture',
    'Typography':    'typography',
    "Artist\u2019s Pick": 'artists-pick',
    'Street Art':    'street-art',
    'Art Objects':   'art-objects'
};

// Store elements for dynamic interactions
const allMarkers = [];
const allLineSources = [];
let routeLineActive = false; // toggle state for line visibility
let currentActiveCategoryId = null;

/**
 * Mix a hex colour toward white by `amount` (0 = original, 1 = pure white).
 * Used to generate a lighter tint for the dark-map glow layer.
 */
function lightenHex(hex, amount) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const mix = (ch) => Math.round(ch + (255 - ch) * amount);
    return `#${mix(r).toString(16).padStart(2,'0')}${mix(g).toString(16).padStart(2,'0')}${mix(b).toString(16).padStart(2,'0')}`;
}

/**
 * Animate a map layer's line-opacity from its current value to `targetOpacity`
 * using an easeInOutCubic curve. Duration in ms (show: ~700, hide: ~350).
 */
function animateLineOpacity(layerId, targetOpacity, duration) {
    if (!map.getLayer(layerId)) return;
    const from = map.getPaintProperty(layerId, 'line-opacity') ?? 0;
    if (from === targetOpacity) return;
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    (function tick(now) {
        const t  = Math.min((now - startTime) / duration, 1);
        const op = from + (targetOpacity - from) * ease(t);
        if (map.getLayer(layerId)) map.setPaintProperty(layerId, 'line-opacity', op);
        if (t < 1) requestAnimationFrame(tick);
    })(startTime);
}

function hydrateSpotDrawer(spot) {
    if (!spot || !spot.properties) return;
    const p = spot.properties;
    
    // Update breadcrumbs
    const currentEl = document.querySelector('.spot-drawer .breadcrumb-current');
    if (currentEl) {
        currentEl.textContent = p.Route || 'Route';
        const rawColor = routeColors[p.Route] || routeColors['Artist’s Pick'];
        currentEl.style.backgroundColor = rawColor;
    }
    
    // Header
    const titleEl = document.querySelector('.spot-drawer .spot-title');
    const subtitleEl = document.querySelector('.spot-drawer .spot-subtitle');
    const locationEl = document.querySelector('.spot-drawer .spot-location span');
    const headerEl = document.querySelector('.spot-drawer .spot-header');
    
    if (headerEl && p.Route) {
        headerEl.style.borderColor = routeColors[p.Route] || routeColors['Artist’s Pick'];
    }
    if (titleEl) titleEl.textContent = p.Name || 'Unknown Spot';
    
    if (subtitleEl) {
        subtitleEl.innerHTML = '';
        if (p.Author) {
            const authorSpan = document.createElement('span');
            authorSpan.textContent = p.Author;
            subtitleEl.appendChild(authorSpan);
        }
        if (p.Year) {
            const yearSpan = document.createElement('span');
            yearSpan.textContent = p.Year;
            subtitleEl.appendChild(yearSpan);
        }
    }
    if (locationEl) locationEl.textContent = p.Location || 'Toronto, ON';
    
    // Hero photo
    const heroImgEl = document.querySelector('.spot-drawer .spot-hero img');
    if (heroImgEl) {
        if (p.IMG) {
            heroImgEl.src = p.IMG;
            heroImgEl.style.display = 'block';
        } else {
            heroImgEl.style.display = 'none';
        }
    }
    
    // Sections
    const sections = document.querySelectorAll('.spot-drawer .spot-section');
    if (sections[0]) {
        const pEl = sections[0].querySelector('p');
        if (pEl) pEl.textContent = p.About || 'No description available for this gem.';
    }
    
    if (sections[1]) {
        const pEl = sections[1].querySelector('p');
        const fact = p["Interesting Fact"] || '';
        if (fact) {
            sections[1].style.display = 'flex';
            if (pEl) pEl.textContent = fact;
        } else {
            sections[1].style.display = 'none';
        }
    }
    
    // Designer note
    const designerNote = document.querySelector('.spot-drawer .spot-designer-note');
    if (designerNote) {
        const pEl = designerNote.querySelector('p');
        const note = p["Designer Note"] || p["Designer's Note"] || '';
        if (note) {
            designerNote.style.display = 'flex';
            if (pEl) pEl.textContent = note;
            designerNote.style.borderColor = routeColors[p.Route] || routeColors['Artist’s Pick'];
        } else {
            designerNote.style.display = 'none';
        }
    }
}

function loadGeoJSONData(geojsonData, fallbackCategory) {
    if (!geojsonData || !geojsonData.features) return;
    
    geojsonData.features.forEach((feature, index) => {
        let cssClass;
        if (feature.properties && feature.properties.Route) {
            cssClass = routeClassNames[feature.properties.Route] || fallbackCategory;
        } else {
            cssClass = fallbackCategory;
        }
        
        const color = Object.values(routeClassNames).includes(cssClass) 
            ? Object.keys(routeClassNames).find(key => routeClassNames[key] === cssClass)
            : 'Unknown';
        const finalColor = routeColors[color] || '#ffffff';
        
        if (feature.geometry.type === 'Point') {
            const coords = feature.geometry.coordinates;
            const name = feature.properties.Name || 'Unknown Spot';
            const hint = feature.properties["Clue / Hint"] || 'No hint available.';
            
            let imageUrl = '';
            if (feature.properties.IMG) {
                imageUrl = feature.properties.IMG;
            }
            
            const el = document.createElement('div');
            el.className = `map-marker route-${cssClass}`;
            el.setAttribute('data-category', cssClass);
            el.style.display = 'none';
            
            const inner = document.createElement('div');
            inner.className = 'marker-inner';
            inner.style.backgroundColor = finalColor;
            if (imageUrl) {
                inner.style.backgroundImage = `url("${imageUrl}")`;
                inner.style.backgroundBlendMode = 'normal';
            }
            el.appendChild(inner);

            if (!imageUrl) {
                el.classList.add('no-image');
                inner.style.color = finalColor;
                inner.style.backgroundColor = `${finalColor}22`;
                inner.style.backgroundImage = '';
            }

            const tooltip = document.createElement('div');
            tooltip.className = 'marker-tooltip';
            tooltip.innerHTML = `<span class="tooltip-title">${name}</span><span class="tooltip-hint">${hint}</span>`;
            el.appendChild(tooltip);

            const thisSpotStruct = { 
                category: cssClass, 
                marker: null, // assigned below
                coords: coords,
                name: name,
                imageUrl: imageUrl,
                properties: feature.properties
            };

            // Interaction logic: Toggle state on click
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const wasActive = el.classList.contains('active');
                
                // Clear any other active marker
                allMarkers.forEach(m => m.marker.getElement().classList.remove('active'));
                
                if (window.innerWidth > 768) {
                    // Desktop Logic
                    if (wasActive && window.closeDrawer) {
                        // If it was already active, the second click should close the drawer (and remove highlight)
                        window.closeDrawer();
                        el.classList.remove('active');
                    } else if (window.openSpotDrawer) {
                        // First click on this new spot -> hydrate and open
                        el.classList.add('active');
                        hydrateSpotDrawer(thisSpotStruct);
                        window.openSpotDrawer();
                    }
                } else {
                    // Mobile Logic
                    el.classList.add('active'); // Always ensure it stays active for tooltip visibility
                    if (wasActive && window.openSpotDrawer) {
                        // On mobile, only open drawer on the SECOND click
                        hydrateSpotDrawer(thisSpotStruct);
                        window.openSpotDrawer();
                    }
                }
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat(coords)
                .addTo(map);

            thisSpotStruct.marker = marker;
            allMarkers.push(thisSpotStruct);

        } else if (feature.geometry.type === 'LineString') {
            const sourceId    = `route-line-${cssClass}-${index}`;
            const haloLayerId = `${sourceId}-halo`;
            const isDarkMap   = currentMapStyle === 'satellite';

            map.addSource(sourceId, { 'type': 'geojson', 'data': feature });

            // ── Glow layer — only on the dark satellite map ────────────────────
            // Starts at opacity 0 (visibility stays 'visible' always so we can
            // animate with setPaintProperty instead of toggling layout visibility).
            if (isDarkMap) {
                map.addLayer({
                    'id':     haloLayerId,
                    'type':   'line',
                    'source': sourceId,
                    'layout': { 'line-join': 'round', 'line-cap': 'round', 'visibility': 'visible' },
                    'paint':  {
                        'line-color':             lightenHex(finalColor, 0.6),
                        'line-width':             16,
                        'line-opacity':           0,   // hidden at start — animated in on CTA click
                        'line-blur':              4,
                        'line-emissive-strength': 1
                    }
                });
            }

            // ── Colour line — always created (dashed, round caps) ─────────────
            map.addLayer({
                'id':     sourceId,
                'type':   'line',
                'source': sourceId,
                'layout': { 'line-join': 'round', 'line-cap': 'round', 'visibility': 'visible' },
                'paint':  {
                    'line-color':             finalColor,
                    'line-width':             5,
                    'line-opacity':           0,    // hidden at start — animated in on CTA click
                    'line-dasharray':         [2, 2],
                    'line-emissive-strength': 1
                }
            });

            // Store target opacities alongside layer IDs so CTA toggle can animate to correct value
            allLineSources.push({
                id:            sourceId,
                haloId:        isDarkMap ? haloLayerId : null,
                category:      cssClass,
                colourOpacity: 0.95,
                haloOpacity:   0.9
            });
        }
    });
}

map.on('click', () => {
    allMarkers.forEach(m => m.marker.getElement().classList.remove('active'));
    const allNearbyItems = document.querySelectorAll('.nearby-item');
    allNearbyItems.forEach(el => el.classList.remove('active'));
    
    // Close the spot drawer if user clicks the map background
    if (window.closeDrawer) window.closeDrawer();
});

map.on('load', () => {
    console.log('Mapbox style loaded successfully!');

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: false
    }), 'bottom-right');

    if (typeof geojsonArchitecture !== 'undefined') loadGeoJSONData(geojsonArchitecture, 'architecture');
    if (typeof geojsonTypography !== 'undefined') loadGeoJSONData(geojsonTypography, 'typography');
    if (typeof geojsonArtistpick !== 'undefined') loadGeoJSONData(geojsonArtistpick, 'artists-pick');
    if (typeof geojsonStreetart !== 'undefined') loadGeoJSONData(geojsonStreetart, 'street-art');
    if (typeof geojsonArtObjects !== 'undefined') loadGeoJSONData(geojsonArtObjects, 'art-objects');
    // New GeoJSON data loaders
    if (typeof geojsonStreetArt !== 'undefined') loadGeoJSONData(geojsonStreetArt, 'street-art');
    if (typeof geojsonArtefacts !== 'undefined') loadGeoJSONData(geojsonArtefacts, 'art-objects');
});

document.addEventListener('routeFilterChange', (e) => {
    const { categoryId, routeName, color, iconUrl } = e.detail;
    currentActiveCategoryId = categoryId;
    routeLineActive = false;
    
    // Validate map data availability
    const categoryMarkers = allMarkers.filter(m => m.category === categoryId);
    const hasData = categoryMarkers.length > 0;
    
    if (!hasData) {
        // Construct a sleek on-screen toast popup instead of a native browser alert
        const toast = document.createElement('div');
        toast.textContent = "🗺️ The route is under construction, we'll add it soon!";
        toast.style.position = 'fixed';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.backgroundColor = 'var(--surface-4, #2A2A2A)';
        toast.style.color = '#FFFFFF';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '24px';
        toast.style.fontFamily = "'Inter', sans-serif";
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(toast);
        
        // Fade in
        setTimeout(() => toast.style.opacity = '1', 10);
        
        // Fade out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
    
    // Dynamically update ALL Near You image grids (desktop sidebar + mobile dock)
    const nearbyGrids = document.querySelectorAll('.nearby-grid');
    const allSpotCountLabels = document.querySelectorAll('.nearby-spots-count');

    nearbyGrids.forEach(nearbyGrid => {
        nearbyGrid.innerHTML = ''; // wipe current elements cleanly
        
        const validVisualSpots = categoryMarkers.filter(m => m.imageUrl && m.imageUrl.length > 0);
        
        // Use up to 6 of the spots randomly or sequentially
        const spotsToDisplay = validVisualSpots.slice(0, 6);
        
        // Update every spot count label
        allSpotCountLabels.forEach(label => {
            label.textContent = `${spotsToDisplay.length} spots`;
        });
        
        spotsToDisplay.forEach(spot => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'nearby-item';
            itemContainer.style.cursor = 'pointer';
            
            const img = document.createElement('img');
            img.src = spot.imageUrl;
            img.alt = spot.name;
            
            itemContainer.appendChild(img);
            
            // Wire up jumping across the map when user clicks the sidebar graphic
            itemContainer.addEventListener('click', () => {
                map.flyTo({ center: spot.coords, zoom: 15, duration: 1200, essential: true });
                
                // Set map marker active
                allMarkers.forEach(m => m.marker.getElement().classList.remove('active'));
                spot.marker.getElement().classList.add('active');
                
                // Set sidebar item active across all grids
                const allNearbyItems = document.querySelectorAll('.nearby-item');
                allNearbyItems.forEach(el => el.classList.remove('active'));
                itemContainer.classList.add('active');
                
                // Open desktop drawer with data!
                if (window.innerWidth > 768 && window.openSpotDrawer) {
                    hydrateSpotDrawer(spot);
                    window.openSpotDrawer();
                }
            });
            
            // Also ensure that if the map marker is clicked manually by the user, this sidebar item highlights!
            spot.marker.getElement().addEventListener('click', () => {
                const allNearbyItems = document.querySelectorAll('.nearby-item');
                allNearbyItems.forEach(el => el.classList.remove('active'));
                
                if (spot.marker.getElement().classList.contains('active')) {
                    itemContainer.classList.add('active');
                }
            });
            
            nearbyGrid.appendChild(itemContainer);
        });
    });

    // Hide all lines instantly (no animation — switching routes is a context change, not a reveal)
    allLineSources.forEach(s => {
        if (map.getLayer(s.id))                   map.setPaintProperty(s.id,     'line-opacity', 0);
        if (s.haloId && map.getLayer(s.haloId))   map.setPaintProperty(s.haloId, 'line-opacity', 0);
    });
    
    // Display only matching markers
    allMarkers.forEach(m => {
        const el = m.marker.getElement();
        el.classList.remove('active'); // reset tooltips
        if (!categoryId || categoryId === m.category) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
    
    // Dynamically update ALL CTA Buttons (desktop + mobile)
    const ctaBtns = document.querySelectorAll('.btn-cta');
    ctaBtns.forEach(ctaBtn => {
        ctaBtn.classList.remove('btn-active-line'); // reset toggle
        ctaBtn.style.pointerEvents = 'auto';
        ctaBtn.style.opacity = '1';
        
        // Default to dark surface color if no route is picked, otherwise use the route's brand color
        let rawOpaqueColor = categoryId ? getComputedStyle(document.body).getPropertyValue(`--cat-${categoryId}`).trim() : 'var(--surface-4)';
        // Fallbacks for variable name mismatch
        if (!rawOpaqueColor && categoryId === 'artists-pick') rawOpaqueColor = getComputedStyle(document.body).getPropertyValue('--cat-artists-choice').trim();
        
        ctaBtn.style.backgroundColor = rawOpaqueColor || 'var(--surface-4)';
        
        const titleEl = ctaBtn.querySelector('.cta-title');
        const subtitleEl = ctaBtn.querySelector('.cta-subtitle');
        const iconContainer = ctaBtn.querySelector('.cta-icon');
        const iconImg = ctaBtn.querySelector('.cta-icon img');
        
        if (titleEl) {
            titleEl.textContent = hasData ? `START ${routeName.toUpperCase()} ROUTE` : `Select a route to begin!`;
            titleEl.style.color = '#FFFFFF';
        }
        
        if (subtitleEl) {
            if (hasData) {
                subtitleEl.textContent = 'View path details and stops';
                subtitleEl.style.display = 'block';
            } else {
                subtitleEl.style.display = 'none';
            }
        }
        if (iconContainer && color) {
            iconContainer.style.backgroundColor = 'var(--brand-trace)'; // Trace-yellow circle per Figma
            iconContainer.style.overflow = 'visible';

            // Clear any previous icon content
            iconContainer.innerHTML = '';

            // Inject icon directly — filter it white so it shows on any colored background
            if (iconUrl) {
                const iconImg = document.createElement('img');
                iconImg.src = iconUrl;
                iconImg.alt = '';
                iconImg.setAttribute('aria-hidden', 'true');
                iconImg.style.width = '20px';
                iconImg.style.height = '20px';
                iconImg.style.display = 'block';
                iconImg.style.filter = 'brightness(0)'; // Force dark — max contrast on yellow bg
                iconContainer.appendChild(iconImg);
            }
        }
        
        // Match the overarching button container color logically
        if (color) {
            ctaBtn.style.backgroundColor = color;
        }
        
        // Lock out clicking if there is no data
        ctaBtn.style.pointerEvents = hasData ? 'auto' : 'none';
        ctaBtn.style.opacity = hasData ? '1' : '0.95';
    });
}); // END routeFilterChange listener

// Handle CTA activation toggle for rendering map lines (works for both desktop + mobile buttons)
const buildCtaLogic = () => {
    document.body.addEventListener('click', (e) => {
        const ctaBtn = e.target.closest('.btn-cta');
        if (!ctaBtn) return;
        
        routeLineActive = !routeLineActive;
        
        // Toggle active class on ALL CTA buttons
        document.querySelectorAll('.btn-cta').forEach(btn => {
            btn.classList.toggle('btn-active-line', routeLineActive);
        });
        
        // Animate lines in/out for current category using easeInOutCubic
        allLineSources.forEach(s => {
            if (s.category === currentActiveCategoryId) {
                const showColour = routeLineActive ? (s.colourOpacity ?? 0.95) : 0;
                const showHalo   = routeLineActive ? (s.haloOpacity   ?? 0.9)  : 0;
                const duration   = routeLineActive ? 700 : 350; // slower reveal, faster hide
                animateLineOpacity(s.id,     showColour, duration);
                if (s.haloId) animateLineOpacity(s.haloId, showHalo, duration);
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', buildCtaLogic);

// ── Map Style Toggle ─────────────────────────────────────────────────────────
// street (light, default) ↔ satellite (dark custom).
// Markers are re-added after setStyle() since it wipes all layers.
// (currentMapStyle declared near top of file, above map init)

document.addEventListener('mapStyleChange', (e) => {
    const { style } = e.detail;
    if (style === currentMapStyle) return;

    currentMapStyle = style;

    // Swap the active route color palette + body class for CSS consumers
    if (style === 'satellite') {
        Object.assign(routeColors, routeColorsDark);
        document.body.classList.add('map-dark');
    } else {
        Object.assign(routeColors, routeColorsLight);
        document.body.classList.remove('map-dark');
    }

    map.setStyle(MAP_STYLES[style]);

    // After the new style loads, restore GeoJSON markers + active filter
    map.once('style.load', () => {
        // Apply faded/day config after full render — same idle trick as initial load
        if (style === 'street') {
            map.once('idle', () => {
                map.setConfigProperty('basemap', 'lightPreset', 'day');
                map.setConfigProperty('basemap', 'theme', 'faded');
            });
        }

        // Remove stale HTML markers before re-creating them
        allMarkers.forEach(m => m.marker.remove());
        allMarkers.length = 0;
        allLineSources.length = 0;

        if (typeof geojsonArchitecture !== 'undefined') loadGeoJSONData(geojsonArchitecture, 'architecture');
        if (typeof geojsonTypography    !== 'undefined') loadGeoJSONData(geojsonTypography,   'typography');
        if (typeof geojsonArtistpick    !== 'undefined') loadGeoJSONData(geojsonArtistpick,   'artists-pick');
        if (typeof geojsonStreetart     !== 'undefined') loadGeoJSONData(geojsonStreetart,    'street-art');
        if (typeof geojsonArtObjects    !== 'undefined') loadGeoJSONData(geojsonArtObjects,   'art-objects');
        if (typeof geojsonArtefacts     !== 'undefined') loadGeoJSONData(geojsonArtefacts,    'art-objects');

        // Re-apply the active route filter
        if (currentActiveCategoryId) {
            allMarkers.forEach(m => {
                const el = m.marker.getElement();
                el.style.display = m.category === currentActiveCategoryId ? 'block' : 'none';
            });
        }
    });
});
