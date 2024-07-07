// temperature-gauge.js

document.addEventListener('DOMContentLoaded', () => {
    const arc = document.querySelector("#temperature-gauge svg path");
    const temperature = document.querySelector("#temperature-gauge #temperature");
    const range = document.querySelector("#temperature-gauge #range");

    const randomValue = Math.floor(Math.random() * (range.max - range.min + 1)) + parseInt(range.min);
    range.value = randomValue;
    updateGauge(randomValue);

    range.addEventListener('input', (e) => {
        updateGauge(e.target.value);
    });

    function updateGauge(value) {
        temperature.textContent = value;

        const arc_length = arc.getTotalLength();
        const step = arc_length / (range.max - range.min);
        const gaugeValue = (value - range.min) * step;
        arc.style.strokeDasharray = `${gaugeValue} ${arc_length - gaugeValue}`;
    }
});
