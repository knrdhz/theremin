let context = new AudioContext(),
    mousedown = false,
    oscillator;

const canvas = document.getElementById('canvas');
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

const getMousePosition = function (evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
};

canvas.addEventListener('mousedown', (e) => {
    mousedown = true;
    oscillator = context.createOscillator();
    let mousePosition = getMousePosition(e);
    oscillator.frequency.setTargetAtTime(calculateFrequency(mousePosition.x), context.currentTime, 0.1);
    gainNode.gain.setTargetAtTime(calculateGain(mousePosition.y), context.currentTime, 0.1);
    oscillator.connect(gainNode);
    oscillator.start(context.currentTime);
});

canvas.addEventListener('mouseup', function () {
    mousedown = false;
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
    }
});
