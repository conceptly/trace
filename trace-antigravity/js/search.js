/**
 * search.js — Trace App
 * Hooks up the desktop (#search-input) and mobile (#mobile-search-input) search
 * bars to the live allMarkers array populated by map.js.
 *
 * Behaviour:
 *  - On Enter or 300ms debounce after typing ≥ 2 chars → search
 *  - Find all markers whose name includes the query (case-insensitive)
 *  - If found: fly to first result, activate its marker, show a subtle result pill
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
            borderRadius: '24px',
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

    // Small pill that shows number of results (auto-hides)
    let resultPillTimer = null;
    function showResultPill(count, name) {
        const old = document.getElementById('search-result-pill');
        if (old) old.remove();
        clearTimeout(resultPillTimer);

        const pill = document.createElement('div');
        pill.id = 'search-result-pill';
        pill.textContent = count === 1 ? `📍 ${name}` : `📍 ${count} spots found`;
        Object.assign(pill.style, {
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--surface-4, #2d4855)',
            color: '#f5f9f6',
            padding: '8px 20px',
            borderRadius: '20px',
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '13px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: '9990',
            opacity: '0',
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
        });

        document.body.appendChild(pill);
        requestAnimationFrame(() => { pill.style.opacity = '1'; });

        resultPillTimer = setTimeout(() => {
            pill.style.opacity = '0';
            setTimeout(() => pill.remove(), 300);
        }, 3000);
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

        const first = matches[0];

        // Fly map to first match
        if (typeof map !== 'undefined') {
            map.flyTo({
                center: first.coords,
                zoom: 15.5,
                duration: 1400,
                essential: true
            });
        }

        // Reset all markers, activate matched ones
        allMarkers.forEach(m => m.marker.getElement().classList.remove('active'));
        matches.forEach(m => m.marker.getElement().classList.add('active'));

        showResultPill(matches.length, first.name);
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
                input.value = '';
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
