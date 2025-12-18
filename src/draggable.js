const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

console.log('Draggable.js loaded, window.electronAPI:', window.electronAPI);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pointAx = 0;
let pointAy = 0;
let recWidth = 0;
let recHeight = 0;
let drag = false;
let finish = false;

canvas.addEventListener('mousedown', event => {
    if (!finish) {
        pointAx = event.clientX;
        pointAy = event.clientY;
        drag = true;
    }
});

canvas.addEventListener('mouseup', event => {
    if (drag) {
        const dimension = {
            x: pointAx,
            y: pointAy,
            width: recWidth,
            height: recHeight
        }
        console.log(dimension)
        window.electronAPI.sendDimension(dimension);
        finish = true;
        drag = false;
    }
});

canvas.addEventListener('mousemove', event => {
    if (!drag) {
        return;
    }


    recWidth = event.clientX - pointAx;
    recHeight = event.clientY - pointAy;

    ctx.strokeStyle = '#adffefff';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeRect(pointAx, pointAy, recWidth, recHeight);
});
