// soil-moisture-gauge.js

document.addEventListener('DOMContentLoaded', () => {
    const arc = document.querySelector("#soil-moisture-gauge svg path");
    const soilMoisture = document.querySelector("#soil-moisture-gauge #temperature");
    const range = document.querySelector("#soil-moisture-gauge #range");

    const randomValue = Math.floor(Math.random() * (range.max - range.min + 1)) + parseInt(range.min);
    range.value = randomValue;
    updateGauge(randomValue);

    range.addEventListener('input', (e) => {
        updateGauge(e.target.value);
    });

    function updateGauge(value) {
        soilMoisture.textContent = value;

        const arc_length = arc.getTotalLength();
        const step = arc_length / (range.max - range.min);
        const gaugeValue = (value - range.min) * step;
        arc.style.strokeDasharray = `${gaugeValue} ${arc_length - gaugeValue}`;
    }
});
