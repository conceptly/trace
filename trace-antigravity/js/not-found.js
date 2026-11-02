// js/not-found.js
// 404 page: suggests a random spot from the route GeoJSON files, with a
// Shuffle button that deals the next one. Spots come from a shuffled deck so
// none repeats until every spot has been shown.

document.addEventListener('DOMContentLoaded', () => {

    // Same route classes and colours as the City Guide catalog
    const routeClassMapping = {
        'Architecture':   'architecture',
        'Typography':     'typography',
        "Artist's Pick":  'artists-pick',
        "Artist’s Pick": 'artists-pick',
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

    // ── Collect spots ─────────────────────────────────────────────────────
    const allSpots = [];

    function processGeoJSON(data, defaultClass) {
        if (!data || !data.features) return;
        data.features.forEach(f => {
            if (!f.geometry || f.geometry.type !== 'Point') return;
            const p = f.properties;
            const routeClass = routeClassMapping[p.Route] || defaultClass;
            // Artist's Pick stays hidden until its route is ready
            if (routeClass === 'artists-pick') return;
            allSpots.push({
                name:       p.Name  || 'Unknown Spot',
                route:      p.Route || '',
                routeClass: routeClass,
                desc:       p.About || p['Designer Note'] || '',
                img:        p.IMG   || ''
            });
        });
    }

    if (typeof geojsonArchitecture !== 'undefined') processGeoJSON(geojsonArchitecture, 'architecture');
    if (typeof geojsonTypography   !== 'undefined') processGeoJSON(geojsonTypography,   'typography');
    if (typeof geojsonStreetart    !== 'undefined') processGeoJSON(geojsonStreetart,    'street-art');
    if (typeof geojsonArtObjects   !== 'undefined') processGeoJSON(geojsonArtObjects,   'art-objects');

    const card = document.getElementById('nf-spot');
    if (!card || allSpots.length === 0) return; // no data: the page still offers Back to the Map

    const photo   = document.getElementById('nf-spot-photo');
    const img     = document.getElementById('nf-spot-img');
    const nameEl  = document.getElementById('nf-spot-name');
    const tagEl   = document.getElementById('nf-spot-tag');
    const descEl  = document.getElementById('nf-spot-desc');
    const explore = document.getElementById('nf-explore');
    const shuffleBtn = document.getElementById('nf-shuffle');

    // ── Deck ──────────────────────────────────────────────────────────────
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    let deck = shuffle(allSpots);
    let index = 0;

    function nextSpot() {
        index++;
        if (index >= deck.length) {
            const last = deck[deck.length - 1];
            deck = shuffle(allSpots);
            // Don't deal the same spot twice in a row across a reshuffle
            if (deck.length > 1 && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]];
            index = 0;
        }
        return deck[index];
    }

    // Warm the browser cache so the next shuffle swaps photos instantly
    function preload(spot) {
        if (spot && spot.img) new Image().src = spot.img;
    }

    function hexToRgba(hex, alpha) {
        const n = parseInt(hex.slice(1), 16);
        return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
    }

    // ── Render ────────────────────────────────────────────────────────────
    function render(spot) {
        const color = routeColorMapping[spot.routeClass] || '#0d7a82';

        photo.style.backgroundColor = color; // shows while the photo loads, or if there is none
        if (spot.img) {
            img.hidden = false;
            img.src = spot.img;
            img.alt = spot.name;
        } else {
            img.hidden = true;
            img.removeAttribute('src');
        }

        nameEl.textContent = spot.name;
        tagEl.textContent = spot.route;
        tagEl.style.backgroundColor = hexToRgba(color, 0.75);
        descEl.textContent = spot.desc;
        descEl.hidden = !spot.desc;

        // The map opens this spot from ?route=&spot= (see index.html)
        const params = new URLSearchParams({ route: spot.routeClass, spot: spot.name });
        explore.href = `index.html?${params}`;
        explore.setAttribute('aria-label', `Explore ${spot.name} on the map`);

        preload(deck[index + 1]);
    }

    img.addEventListener('error', () => { img.hidden = true; });

    // ── Eased change ──────────────────────────────────────────────────────
    // .is-changing fades the photo and text out (not-found.css); the content
    // swaps once they're gone and fades back in when the new photo is ready.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FADE_OUT_MS = reduceMotion ? 0 : 200;
    const MAX_PHOTO_WAIT_MS = 1500; // fade in anyway on a slow connection

    function whenPhotoReady() {
        if (img.hidden || img.complete) return Promise.resolve();
        return new Promise(resolve => {
            const done = () => { clearTimeout(timer); resolve(); };
            const timer = setTimeout(done, MAX_PHOTO_WAIT_MS);
            img.addEventListener('load',  done, { once: true });
            img.addEventListener('error', done, { once: true });
        });
    }

    function easeIn() {
        // Two frames so the browser paints the faded state before it transitions back
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-changing')));
    }

    let changing = false;

    shuffleBtn.addEventListener('click', () => {
        if (changing) return;
        changing = true;
        card.classList.add('is-changing');
        setTimeout(() => {
            render(nextSpot());
            whenPhotoReady().then(() => {
                easeIn();
                changing = false;
            });
        }, FADE_OUT_MS);
    });

    // First spot eases in the same way
    card.classList.add('is-changing');
    render(deck[index]);
    card.hidden = false;
    whenPhotoReady().then(easeIn);
});
