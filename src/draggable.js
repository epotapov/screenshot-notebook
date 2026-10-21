const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pointAx = 0;
let pointAy = 0;
let recWidth = 0;
let recHeight = 0;
let drag = false;

canvas.addEventListener('pointerdown', event => {
    if (!drag) {
        drag = true;

        pointAx = event.clientX;
        pointAy = event.clientY;
    }
});

canvas.addEventListener('pointerup', event => {
    if (drag) {
        if (recWidth < 0) {
            pointAx = pointAx + recWidth;
            recWidth = Math.abs(recWidth);
        }

        if (recHeight < 0) {
            pointAy = pointAy + recHeight;
            recHeight = Math.abs(recHeight);
        }

        const dimension = {
            x: pointAx,
            y: pointAy,
            width: recWidth,
            height: recHeight
        }
        window.electronAPI.sendDimension(dimension);
        drag = false;
    }
});

canvas.addEventListener('pointermove', event => {
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
