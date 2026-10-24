# screenshot-notebook

A desktop app for taking screenshots and snips and keeping them as a running notebook. 

## List of current features:

1. **Full screenshot** (`+` or `Ctrl+A`): captures the whole display the app is on. 
2. **Snip** (`☐` or `Ctrl+S`): freezes the screen so you can drag a box around the part you want.
3. **Screenshot tabs**: each capture gets its own tab. Click a tab to view it, and scroll the mouse wheel to move through them.
4. **Copy** (`C` or `Ctrl+C`): copies the selected screenshot to the clipboard as an image.
5. **Delete** (`x` on a tab or `Ctrl+D`): deletes the screenshot from disk and closes its tab.
6. **Saved automatically**: screenshots go to `Pictures/screenshot-notebook` and are loaded back as tabs when the app starts.

## Getting started

```sh
npm install
npm start
```

Create an executable

```sh
npm run make
```

## Current list of features to be added:

1. Better viewer for screenshots
2. Improve performance
