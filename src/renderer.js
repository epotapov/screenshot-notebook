const tabBar = document.getElementById('tab-bar');
const wholeButton = document.getElementById('screenshot-btn-whole');
const snipButton = document.getElementById('screenshot-btn-snip');
const copyButton = document.getElementById('screenshot-btn-copy');
const welcomeMessage = document.getElementById('welcome-message');
const image = document.getElementById('screenshot');
const copyToast = document.getElementById('copy-toast');

const selectedTab = '#0d61d4'; 

let filesList;
let fileName = '';
let scrollTarget = 0;
let scrolling = false;

const showCopyToast = () => {
  copyToast.classList.remove('show');
  void copyToast.offsetWidth;
  copyToast.classList.add('show');
};

const animateScroll = () => {
    const distance = scrollTarget - tabBar.scrollLeft;
    
    if (Math.abs(distance) < 5) {
        tabBar.scrollLeft = scrollTarget;
        scrolling = false;
        return;
    }

    tabBar.scrollLeft += distance * 0.2;
    requestAnimationFrame(animateScroll);
};

const smoothScrollTo = (value) => {
    const max = tabBar.scrollWidth - tabBar.clientWidth;
    scrollTarget = Math.max(0, Math.min(value, max));
    
    if (!scrolling) {
        scrolling = true;
        requestAnimationFrame(animateScroll);
    }
};

tabBar.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    let start;
    if (scrolling) {
        start = scrollTarget;
    }
    else {
        start = tabBar.scrollLeft;
    }
    
    let delta;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        delta = event.deltaX;
    }
    else {
        delta = event.deltaY;
    }
    
    smoothScrollTo(start + delta * 2);
});

wholeButton.addEventListener('click', async () => {
    console.log("making a screenshot")
    try {
        const capturePath = await window.electronAPI.captureWindow();
        image.src = `file://${capturePath.path}`;
        filesList[capturePath.name] = capturePath;
        const tab = addTab(capturePath.name);
        const tabs = document.querySelectorAll('#tab-bar .screenshot-tab');
      
        tabs.forEach((t) => {
            if (capturePath.name === t.id) {
                image.src = filesList[t.id].path;
            }

            t.style.backgroundColor = '#1f2229';
        });
      
        tab.style.backgroundColor = selectedTab;

        welcomeMessage.style.display = 'none';
        image.style.display = 'flex';
    }
    catch (error) {
        console.error(error);
    }
});

snipButton.addEventListener('click', async () => {
    console.log("snipping a screenshot")
    try {
        const capturePath = await window.electronAPI.captureSnip();
        image.src = `file://${capturePath.path}`;
        filesList[capturePath.name] = capturePath;
        const tab = addTab(capturePath.name);
        const tabs = document.querySelectorAll('#tab-bar .screenshot-tab');
      
        tabs.forEach((t) => {
            if (capturePath.name === t.id) {
                image.src = filesList[t.id].path;
            }

            t.style.backgroundColor = '#1f2229';
        });
      
        tab.style.backgroundColor = selectedTab;

        welcomeMessage.style.display = 'none';
        image.style.display = 'flex';
    }
    catch (error) {
        console.error(error);
    }
});


const addTab = (name) => {
    const tab = document.createElement('div');
    tab.className = 'screenshot-tab';

    tab.id = name;

    const span = document.createElement('span');
    span.innerText = name;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.innerText = 'x';

    closeButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        const file = filesList[name];
        if (!file) {
            return;
        }

        const result = await window.electronAPI.deleteScreenshot(file.path);
        if (result) {
            const fileNames = Object.keys(filesList);
            const index = fileNames.indexOf(name);
            
            delete filesList[name];

            if (tab.parentNode) {
                tab.parentNode.removeChild(tab);
            }

            if (fileName === name) {
                if (index > 0) {
                    const prev = fileNames[index - 1];
                    const prevTab = document.getElementById(prev);
                    if (prevTab) {
                        prevTab.click();
                    }
                }
                else if (index == 0 && fileNames.length > 1) {
                    const next = fileNames[1];
                    const nextTab = document.getElementById(next);
                    if (nextTab) {
                        nextTab.click();
                    }
                }
                else {
                    image.src = '';
                    image.style.display = 'none';
                    welcomeMessage.style.display = 'flex';
                }
            }
        } else {
            console.error('Failed to delete file');
        }
    });

    tab.addEventListener('click', () => {
        const tabs = document.querySelectorAll('#tab-bar .screenshot-tab');
      
        tabs.forEach((t) => {
            if (tab.id === t.id) {
                image.src = filesList[t.id].path;
            }

            t.style.backgroundColor = '#1f2229';
        });
      
        tab.style.backgroundColor = selectedTab;

        welcomeMessage.style.display = 'none';
        image.style.display = 'flex';
        fileName = name;
    });

    tab.appendChild(span);
    tab.appendChild(closeButton);
    tabBar.appendChild(tab);
    smoothScrollTo(tabBar.scrollWidth);
    fileName = name;
    return tab;
}

copyButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const file = filesList[fileName];
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

document.addEventListener('keydown', async (e) => {
    const isCopy = (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C');
    if (!isCopy) {
        return;
    }

    const file = filesList[fileName];
    if (!file) {
        return;
    }

    try {
        const ok = await window.electronAPI.copyScreenshot(file.path);
        if (ok) {
            console.log('Image copied to clipboard via keyboard');
            showCopyToast();
        }
    } catch (err) {
        console.error('Error copying image via keyboard:', err);
    }
});

window.electronAPI.filesList((files) => {
    filesList = files.reduce((dict, file) => {
        dict[file.name] = file;
        return dict;
    }, {});
    console.log(filesList);
    files.forEach((file) => {
        addTab(file.name);
        fileName = '';
    });
});

