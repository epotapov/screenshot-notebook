const tabBar = document.getElementById('tab-bar')

tabBar.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scrollSpeed = 4; 

    tabBar.scrollBy({
        left: event.deltaY * scrollSpeed,
        behavior: 'smooth'
    });
});