/* trace-antigravity/js/nav.js */

document.addEventListener('DOMContentLoaded', () => {
    const routeWrappers = document.querySelectorAll('.route-wrapper');
    
    routeWrappers.forEach(wrapper => {
        const btn = wrapper.querySelector('.route-item');
        if (btn) {
            btn.addEventListener('click', () => {
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // Mobile Interaction State Machine
                    if (wrapper.classList.contains('active')) {
                        if (wrapper.classList.contains('mobile-open')) {
                            // 2nd click: Close text flap immediately, remain active
                            wrapper.classList.remove('mobile-open');
                            if (wrapper.closeTimer) clearTimeout(wrapper.closeTimer);
                        } else {
                            // Click on active-closed: Deactivate route!
                            wrapper.classList.remove('active');
                            wrapper.classList.add('inactive');
                            
                            // Emit reset event to clear the map entirely
                            document.dispatchEvent(new CustomEvent('routeFilterChange', { detail: { categoryId: 'reset' } }));
                        }
                        return; // Stop here if it was already active
                    }
                } else {
                    // Desktop Interaction
                    if (wrapper.classList.contains('active')) return;
                }

                // Activate logic (1st click or new selection)
                routeWrappers.forEach(w => {
                    w.classList.remove('active', 'mobile-open');
                    w.classList.add('inactive');
                    if (w.closeTimer) clearTimeout(w.closeTimer);
                });
                
                wrapper.classList.add('active');
                wrapper.classList.remove('inactive');
                
                if (isMobile) {
                    wrapper.classList.add('mobile-open');
                    wrapper.closeTimer = setTimeout(() => {
                        wrapper.classList.remove('mobile-open');
                    }, 3000); // 3 second delay to slide back
                }
                
                const category = wrapper.getAttribute('data-category');
                const displayName = wrapper.querySelector('.route-name').textContent;
                console.log(`Route selected: ${category}`);
                
                // Extract active styling to pipe to CTA button updates
                const routeIconContainer = wrapper.querySelector('.route-icon');
                let activeColor = routeIconContainer ? routeIconContainer.style.backgroundColor : '';
                
                // Extract computational CSS var on Mobile
                if (isMobile) {
                    activeColor = getComputedStyle(wrapper).getPropertyValue('--route-bg').trim() || activeColor;
                }

                const activeImgElement = routeIconContainer ? routeIconContainer.querySelector('img') : null;
                const activeImgUrl = activeImgElement ? activeImgElement.src : '';
                
                // Dispatch event for Mapbox and CTA logic to capture
                const filterEvent = new CustomEvent('routeFilterChange', { 
                    detail: { 
                        categoryId: category, 
                        routeName: displayName,
                        color: activeColor,
                        iconUrl: activeImgUrl
                    } 
                });
                document.dispatchEvent(filterEvent);
            });
        }
    });

    // Mobile Hamburger Menu Toggle
    const mobileHamburgerBtn = document.querySelector('.mobile-hamburger');
    const mobileMenuOverlay = document.getElementById('mobileMenu');

    if (mobileHamburgerBtn && mobileMenuOverlay) {
        mobileHamburgerBtn.addEventListener('click', () => {
            mobileHamburgerBtn.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('active');
            
            // Prevent body scroll when nav is open
            if (mobileMenuOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Helper: close the hamburger menu cleanly
    function closeMobileMenu() {
        if (!mobileHamburgerBtn || !mobileMenuOverlay) return;
        mobileHamburgerBtn.classList.remove('open');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Hamburger Menu Route Buttons → activate route + close menu
    const menuRouteBtns = document.querySelectorAll('#mobileMenu .route-btn');
    menuRouteBtns.forEach(menuBtn => {
        menuBtn.addEventListener('click', () => {
            // Derive categoryId from the button's class list
            // Classes are like: menu-btn route-btn typography
            const categoryId = [...menuBtn.classList].find(c =>
                !['menu-btn', 'route-btn', 'full-width'].includes(c)
            );
            if (!categoryId) return;

            // Find the matching sidebar route-wrapper
            const matchingSidebarWrapper = document.querySelector(
                `.route-wrapper[data-category="${categoryId}"]`
            );

            // Trigger the same active-state machine as the sidebar buttons
            routeWrappers.forEach(w => {
                w.classList.remove('active', 'mobile-open');
                w.classList.add('inactive');
                if (w.closeTimer) clearTimeout(w.closeTimer);
            });

            if (matchingSidebarWrapper) {
                matchingSidebarWrapper.classList.add('active');
                matchingSidebarWrapper.classList.remove('inactive');
            }

            // Extract color + icon from the sidebar wrapper for the CTA button
            let activeColor = '';
            let activeImgUrl = '';
            let displayName = categoryId;
            if (matchingSidebarWrapper) {
                const routeIconEl = matchingSidebarWrapper.querySelector('.route-icon');
                activeColor = getComputedStyle(matchingSidebarWrapper)
                    .getPropertyValue('--route-bg').trim() ||
                    (routeIconEl ? routeIconEl.style.backgroundColor : '');
                const imgEl = routeIconEl ? routeIconEl.querySelector('img') : null;
                activeImgUrl = imgEl ? imgEl.src : '';
                const nameEl = matchingSidebarWrapper.querySelector('.route-name');
                displayName = nameEl ? nameEl.textContent.trim() : categoryId;
            }

            // Dispatch the same event map.js listens to
            document.dispatchEvent(new CustomEvent('routeFilterChange', {
                detail: {
                    categoryId,
                    routeName: displayName,
                    color: activeColor,
                    iconUrl: activeImgUrl
                }
            }));

            // Highlight the active menu button
            menuRouteBtns.forEach(b => b.classList.remove('active'));
            menuBtn.classList.add('active');

            // Close menu after short pause so user sees the tap feedback
            setTimeout(closeMobileMenu, 280);
        });
    });

    // Hamburger Map nav button → just close menu (already on map page)
    const menuNavBtns = document.querySelectorAll('#mobileMenu .nav-btn');
    menuNavBtns.forEach(navBtn => {
        navBtn.addEventListener('click', closeMobileMenu);
    });

    // Mobile Search Bar Toggle
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    const mobileFloatingSearch = document.querySelector('.mobile-floating-search');

    if (mobileSearchBtn && mobileFloatingSearch) {
        mobileSearchBtn.addEventListener('click', () => {
            mobileFloatingSearch.classList.toggle('mobile-search-active');
            if (mobileFloatingSearch.classList.contains('mobile-search-active')) {
                document.body.classList.add('mobile-search-is-open');
            } else {
                document.body.classList.remove('mobile-search-is-open');
            }
        });
    }

    // Near You Bottom Drawer Toggle (Click & Swipe)
    const mobileDock = document.getElementById('mobile-bottom-dock');
    const nearbyHeader = mobileDock ? mobileDock.querySelector('.nearby-header') : null;

    if (mobileDock && nearbyHeader) {
        // Tap Toggle on header
        nearbyHeader.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileDock.classList.toggle('drawer-open');
            }
        });

        // Touch Swipe Toggle on entire dock
        let startY = 0;
        mobileDock.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
        }, {passive: true});

        mobileDock.addEventListener('touchend', e => {
            if (window.innerWidth > 768) return;
            const endY = e.changedTouches[0].clientY;
            if (startY - endY > 40) { // Swiped up → open
                mobileDock.classList.add('drawer-open');
            } else if (endY - startY > 40) { // Swiped down → close
                mobileDock.classList.remove('drawer-open');
            }
        }, {passive: true});
    }

    // Simple Theme Switcher mock (can be expanded)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            console.log('Search focused');
        });
    }

    // Quick Guide Drawer Toggle
    const guideBtn = document.querySelector('.quick-guide-btn');
    const closeGuideBtn = document.getElementById('close-guide');
    const goToGuideBtn = document.getElementById('go-to-guide');
    const drawer = document.getElementById('guide-drawer');
    const overlay = document.getElementById('guide-overlay');

    const spotDrawer = document.getElementById('spot-drawer');
    const closeSpotBtns = document.querySelectorAll('.close-spot');

    function toggleCityGuideMenu(isSpotOpen) {
        const navBtns = document.querySelectorAll('.menu-section .nav-btn');
        if (navBtns.length >= 2) {
            const mapBtn = navBtns[0];
            const cityGuideBtn = navBtns[1];
            if (isSpotOpen) {
                mapBtn.classList.remove('active');
                cityGuideBtn.classList.add('active');
            } else {
                cityGuideBtn.classList.remove('active');
                mapBtn.classList.add('active');
            }
        }
    }

    function openDrawer() {
        if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        }
    }

    function openSpotDrawer() {
        if (spotDrawer) {
            spotDrawer.classList.add('active');
            // Deliberately NOT adding the overlay class so the map is visible and interactive
            toggleCityGuideMenu(true);
        }
    }

    function closeDrawer() {
        if (drawer) drawer.classList.remove('active');
        if (spotDrawer) spotDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        toggleCityGuideMenu(false);
    }

    if (guideBtn) guideBtn.addEventListener('click', openDrawer);
    if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeDrawer);
    if (goToGuideBtn) goToGuideBtn.addEventListener('click', closeDrawer);
    
    closeSpotBtns.forEach(btn => btn.addEventListener('click', closeDrawer));

    if (overlay) overlay.addEventListener('click', closeDrawer);
    
    // For testing/global access purposes, expose drawer controls globally
    window.openSpotDrawer = openSpotDrawer;
    window.closeDrawer = closeDrawer;
});
