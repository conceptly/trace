// Setup Mapbox GL JS map
mapboxgl.accessToken = 'pk.eyJ1IjoiZXR1YWwtY29uY2VwdGx5IiwiYSI6ImNtbHU5ZjlvbjA5MmkzanEzeGd3eHI1ajQifQ.kD3o5_-eHOmsWmBQfP7RFg';

const map = new mapboxgl.Map({
    container: 'mapbox-container',
    style: 'mapbox://styles/etual-conceptly/cmmy1pnn9000301qu6z8k4zta', // Base Dark Style with routes
    center: [-79.3832, 43.6532], // Downtown Toronto
    zoom: 13.5
});

// Force Mapbox V3 Standard parameters before data layers load
map.on('style.load', () => {
    map.setConfigProperty('basemap', 'lightPreset', 'day');
    map.setConfigProperty('basemap', 'theme', 'faded');
});

// Route Color Mapping referenced from CSS variables
const routeColors = {
    'Architecture': '#9A4520', /* fallback from --cat-architecture */
    'Typography': '#2B5EA8',
    'Artist’s Pick': '#0D7A82',
    'Street Art': '#A0522D',
    'Art Objects': '#6B4E9A'
};

const routeClassNames = {
    'Architecture': 'architecture',
    'Typography': 'typography',
    'Artist’s Pick': 'artists-pick',
    'Street Art': 'street-art',
    'Art Objects': 'art-objects'
};

// Store elements for dynamic interactions
const allMarkers = [];
const allLineSources = [];
let routeLineActive = false; // toggle state for line visibility
let currentActiveCategoryId = null;

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
            const sourceId = `route-line-${cssClass}-${index}`;
            map.addSource(sourceId, { 'type': 'geojson', 'data': feature });
            map.addLayer({
                'id': sourceId,
                'type': 'line',
                'source': sourceId,
                'layout': { 'line-join': 'round', 'line-cap': 'round', 'visibility': 'none' },
                'paint': { 'line-color': finalColor, 'line-width': 5, 'line-opacity': 0.8 }
            });

            map.setLayoutProperty(sourceId, 'visibility', 'none');
            allLineSources.push({ id: sourceId, category: cssClass });
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

    // Hide all lines
    allLineSources.forEach(s => {
        if (map.getLayer(s.id)) map.setLayoutProperty(s.id, 'visibility', 'none');
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
            iconContainer.style.backgroundColor = 'var(--brand-trace)'; // Explicit trace-yellow circle per Figma 
            iconContainer.style.overflow = 'hidden'; // Required for shadow clipping
            
            // Clean up any old implementations
            const oldMask = iconContainer.querySelector('.mask-icon');
            if (oldMask) oldMask.remove();
            let rawImg = iconContainer.querySelector('img:not(.shadow-img)');
            if (rawImg) rawImg.remove();
            
            // Build absolute drop-shadow filter element
            let shadowWrapper = iconContainer.querySelector('.shadow-wrapper');
            if (!shadowWrapper) {
                shadowWrapper = document.createElement('div');
                shadowWrapper.className = 'shadow-wrapper';
                shadowWrapper.style.width = '24px';
                shadowWrapper.style.height = '24px';
                shadowWrapper.style.position = 'relative';
                shadowWrapper.style.left = '-100px'; // Shove original out of frame
                iconContainer.appendChild(shadowWrapper);
                
                const shadowImg = document.createElement('img');
                shadowImg.className = 'shadow-img';
                shadowImg.style.width = '100%';
                shadowImg.style.height = '100%';
                shadowImg.style.display = 'block';
                shadowWrapper.appendChild(shadowImg);
            }
            
            if (iconUrl) {
                const img = shadowWrapper.querySelector('img');
                img.src = iconUrl;
                // Force to black for solid projection, then aggressively project colored shadow back into frame perfectly
                img.style.filter = `brightness(0) drop-shadow(100px 0 0 ${color})`;
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
        
        // Turn lines on/off for current category
        allLineSources.forEach(s => {
            if (s.category === currentActiveCategoryId && map.getLayer(s.id)) {
                map.setLayoutProperty(s.id, 'visibility', routeLineActive ? 'visible' : 'none');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', buildCtaLogic);
