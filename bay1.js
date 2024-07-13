document.addEventListener('DOMContentLoaded', () => {
    // Function to redirect to node1.html
    function redirectToNode1() {
        window.location.href = 'node1.html'; // Replace with the actual path to node1.html
    }

    // Attach the redirectToNode1 function to the onclick event of Node 1
    const node1 = document.querySelector('.node:nth-child(1)');
    node1.addEventListener('click', redirectToNode1);

    // Initialize Chart.js chart if summary-chart canvas exists
    const summaryCtx = document.getElementById('summary-chart')?.getContext('2d');
    if (summaryCtx) {
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


    // Create gauges
    const soilMoistureGauge = new JustGage({
        id: "soil-moisture-gauge",
        value: 87.5,
        min: 0,
        max: 100,
        title: "Soil Moisture",
        label: "%",
        pointer: true,
        gaugeWidthScale: 0.6,
        levelColors: ["#00ff00", "#ff0000"]
    });

    const temperatureGauge = new JustGage({
        id: "temperature-gauge",
        value: 32.5,
        min: 0,
        max: 50,
        title: "Temperature",
        label: "°C",
        pointer: true,
        gaugeWidthScale: 0.6,
        levelColors: ["#00ff00", "#ff0000"]
    });

    const humidityGauge = new JustGage({
        id: "humidity-gauge",
        value: 85,
        min: 0,
        max: 100,
        title: "Humidity",
        label: "%",
        pointer: true,
        gaugeWidthScale: 0.6,
        levelColors: ["#00ff00", "#ff0000"]
    });

    // Sample sensor data
    document.getElementById('last-reading').innerText = '8:00pm, September 7, 2019';

    // Function to redirect to node1.html
    function redirectToNode1() {
        window.location.href = 'node1.html'; // Replace with the actual path to node1.html
    }

    // Attach the redirectToNode1 function to the onclick event of Node 1
    const node1 = document.querySelector('.node:nth-child(1)');
    node1.addEventListener('click', redirectToNode1);
});
