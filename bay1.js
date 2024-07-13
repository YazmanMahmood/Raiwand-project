document.addEventListener('DOMContentLoaded', () => {
    // Check if summary-chart canvas exists before accessing getContext
    const summaryCanvas = document.getElementById('summary-chart');
    if (summaryCanvas) {
        const summaryCtx = summaryCanvas.getContext('2d');
        const summaryChart = new Chart(summaryCtx, {
            type: 'line',
            data: {
                labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
                datasets: [{
                    label: 'Temperature',
                    data: [30, 25, 28, 26, 27, 29, 32],
                    backgroundColor: 'rgba(26, 188, 156, 0.2)',
                    borderColor: 'rgba(26, 188, 156, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true,
                        max: 50
                    }
                }
            }
        });
    }
function redirectToNode1() {
    window.location.href = 'node1.html';
}
    // Create gauges if the corresponding elements exist
    const createGauge = (id, value, title, label) => {
        const gaugeElement = document.getElementById(id);
        if (gaugeElement) {
            new JustGage({
                id: id,
                value: value,
                min: 0,
                max: 100,
                title: title,
                label: label,
                pointer: true,
                gaugeWidthScale: 0.6,
                levelColors: ["#00ff00", "#ff0000"]
            });
        }
    };

    createGauge("soil-moisture-gauge", 87.5, "Soil Moisture", "%");
    createGauge("temperature-gauge", 32.5, "Temperature", "°C");
    createGauge("humidity-gauge", 85, "Humidity", "%");

    // Set sample sensor data if the element exists
    const lastReadingElement = document.getElementById('last-reading');
    if (lastReadingElement) {
        lastReadingElement.innerText = '8:00pm, September 7, 2019';
    }
});
