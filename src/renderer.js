const tabBar = document.getElementById('tab-bar');
const wholeButton = document.getElementById('screenshot-btn-whole');
const image = document.getElementById('screenshot')

tabBar.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scrollSpeed = 4; 

    tabBar.scrollBy({
        left: event.deltaY * scrollSpeed,
        behavior: 'smooth'
    });
});

wholeButton.addEventListener('click', async () => {
    console.log("making a screenshot")
    try {
        const capturePath = await window.electronAPI.captureWindow();
        image.src = `file://${capturePath}`;
    }
    catch (error) {
        console.error(error);
    }
});

