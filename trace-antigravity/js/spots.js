/* trace-antigravity/js/spots.js */

const STUB_SPOTS = [
    { id: 1, name: "Graffiti Alley", category: "Street Art", lat: 0.4, lng: 0.6 },
    { id: 2, name: "Union Station", category: "Architecture", lat: 0.45, lng: 0.65 },
    { id: 3, name: "Art Gallery of Ontario", category: "Art Objects", lat: 0.6, lng: 0.55 }
];

document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('map');
    
    // In a real implementation, we would clear and rebuild markers based on the selected route
    console.log('TRACE Spots module initialized');
    
    const markers = document.querySelectorAll('.map-marker');
    markers.forEach(marker => {
        marker.addEventListener('click', (e) => {
            const label = marker.getAttribute('aria-label');
            alert(`Selected: ${label}`);
        });
    });
});
