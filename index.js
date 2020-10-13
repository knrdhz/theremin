let context = new AudioContext(),
    mousedown = false,
    oscillator,
    circleDrawn = false,
    circle = {},
    drag = false;

const canvas = document.getElementById('theremin');
const ctx = canvas.getContext('2d');
console.log(canvas);

let gainNode = context.createGain();
gainNode.connect(context.destination);

let calculateFrequency = function (mouseXPosition) {
    let minFrequency = 20,
        maxFrequency = 2000;
    return (mouseXPosition / canvas.width) * maxFrequency + minFrequency;
};

let calculateGain = function (mouseYPosition) {
    let minGain = 0,
        maxGain = 1;
    console.log('Y', mouseYPosition);
    return 1 - (mouseYPosition / canvas.height) * maxGain + minGain;
};

const getMousePosition = function (e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
};

const drawCircle = function (circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
};

const mouseDown = function (e) {
    mousedown = true;
    oscillator = context.createOscillator();
    let mousePosition = getMousePosition(e);

    oscillator.frequency.setTargetAtTime(calculateFrequency(mousePosition.x), context.currentTime, 0.1);
    gainNode.gain.setTargetAtTime(calculateGain(mousePosition.y), context.currentTime, 0.1);
    oscillator.connect(gainNode);
    oscillator.start(context.currentTime);

    circle.x = mousePosition.x;
    circle.y = mousePosition.y;

    drawCircle(circle);

    drag = true;
};

canvas.addEventListener('mousedown', mouseDown);

canvas.addEventListener('mouseup', function () {
    mousedown = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (oscillator) {
        oscillator.stop(context.currentTime);
        oscillator.disconnect();
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (mousedown && oscillator) {
        let mousePosition = getMousePosition(e);
        oscillator.frequency.setTargetAtTime(calculateFrequency(mousePosition.x), context.currentTime, 0.1);
        gainNode.gain.setTargetAtTime(calculateGain(mousePosition.y), context.currentTime, 0.1);
        if (drag) {
            circle.x = mousePosition.x;
            circle.y = mousePosition.y;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCircle(circle);
        }
    }
});
