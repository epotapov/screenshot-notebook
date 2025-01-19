const tabBar = document.getElementById('tab-bar');
const wholeButton = document.getElementById('screenshot-btn-whole');
const welcomeMessage = document.getElementById('welcome-message');
const image = document.getElementById('screenshot');

tabBar.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scrollSpeed = 5; 

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

const addTab = (name) => {
    // Tab div
    const tab = document.createElement('div');
    tab.className = 'screenshot-tab';

    // Text in tab
    const span = document.createElement('span');
    span.innerText = name;

    // Button in div
    const button = document.createElement('button');
    button.className = 'close-btn';
    button.innerText = 'x';

    button.addEventListener('click', () => {
        console.log(`closing tab ${name}!`);
    });

    tab.appendChild(span);
    tab.appendChild(button);
    tabBar.appendChild(tab);
}

window.electronAPI.filesList((files) => {
    files.forEach((file) => {
        console.log(file);
        addTab(file.name);
    });
});

