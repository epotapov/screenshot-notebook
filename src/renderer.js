const tabBar = document.getElementById('tab-bar');
const wholeButton = document.getElementById('screenshot-btn-whole');
const welcomeMessage = document.getElementById('welcome-message');
const image = document.getElementById('screenshot');

const selectedTab = '#0e639c'; 

let filesList;

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
        image.src = `file://${capturePath.path}`;
        filesList[capturePath.name] = capturePath;
        const tab = addTab(capturePath.name);
        const tabs = document.querySelectorAll('#tab-bar .screenshot-tab');
      
        // Iterate through all tabs
        tabs.forEach((t) => {
            if (capturePath.name === t.id) {
                image.src = filesList[t.id].path;
            }

            t.style.backgroundColor = '#2d2d2d';
        });
      
        // Change the background color of the clicked tab
        tab.style.backgroundColor = selectedTab;

        welcomeMessage.style.display = 'none';
        image.style.display = 'flex';
    }
    catch (error) {
        console.error(error);
    }
});

// Define hover functions to reuse

const addTab = (name) => {
    // Tab div
    const tab = document.createElement('div');
    tab.className = 'screenshot-tab';

    tab.id = name;

    // Text in tab
    const span = document.createElement('span');
    span.innerText = name;

    // Button in div
    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.innerText = 'x';

    // the button listener
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(`closing tab ${name}!`);
    });

    // tab listener
    tab.addEventListener('click', () => {
        const tabs = document.querySelectorAll('#tab-bar .screenshot-tab');
      
        // Iterate through all tabs
        tabs.forEach((t) => {
            if (tab.id === t.id) {
                image.src = filesList[t.id].path;
            }

            t.style.backgroundColor = '#2d2d2d';
        });
      
        // Change the background color of the clicked tab
        tab.style.backgroundColor = selectedTab;

        welcomeMessage.style.display = 'none';
        image.style.display = 'flex';
    });

    // add the components to the page
    tab.appendChild(span);
    tab.appendChild(closeButton);
    tabBar.appendChild(tab);
    return tab;
}

window.electronAPI.filesList((files) => {
    filesList = files.reduce((dict, file) => {
        dict[file.name] = file; // Use the 'id' as the key
        return dict;
    }, {});
    console.log(filesList);
    files.forEach((file) => {
        // console.log(file);
        addTab(file.name);
    });
});

