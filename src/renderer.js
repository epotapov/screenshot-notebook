const tabBar = document.getElementById('tab-bar');
const wholeButton = document.getElementById('screenshot-btn-whole');
const copyButton = document.getElementById('screenshot-btn-whole-copy');
const welcomeMessage = document.getElementById('welcome-message');
const image = document.getElementById('screenshot');
const copyToast = document.getElementById('copy-toast');

const selectedTab = '#0e639c'; 

let filesList;

const showCopyToast = () => {
  copyToast.classList.remove('show');
  void copyToast.offsetWidth;
  copyToast.classList.add('show');
};

tabBar.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scrollSpeed = 7;
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


document.addEventListener('keydown', async (e) => {
    const isCopy = (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C');
    if (!isCopy) {
        return;
    }

    // Only act if image is visible
    if (image.style.display === 'none' || !image.src) {
        return;
    }

    try {
        const filePath = (new URL(image.src)).pathname;
        const ok = await window.electronAPI.copyScreenshot(filePath);
        if (ok) {
            console.log('Image copied to clipboard via keyboard');
            showCopyToast();
        }
    } catch (err) {
        console.error('Error copying image via keyboard:', err);
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
    closeButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        const file = filesList[name];
        if (!file) {
            return;
        }

        const result = await window.electronAPI.deleteScreenshot(file.path);
        if (result) {
            delete filesList[name];

            if (tab.parentNode) {
                tab.parentNode.removeChild(tab);
            }

            if (image.src.split(/[/\\]/).pop() === file.path.split(/[/\\]/).pop()) {
                image.src = '';
                image.style.display = 'none';
                welcomeMessage.style.display = 'flex';
            }
        } else {
            console.error('Failed to delete file ', result);
        }
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

    copyButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const file = filesList[name];
        if (!file) {
            return;
        }

        try {
            const ok = await window.electronAPI.copyScreenshot(file.path);
            if (ok) {
                console.log('Image copied to clipboard');
                showCopyToast();
            } else {
                console.error('Failed to copy image');
            }
        } catch (err) {
            console.error('Error copying image:', err);
        }
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

