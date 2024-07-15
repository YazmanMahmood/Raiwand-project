// Redirect functions for each node
function redirectToNode1() {
    window.location.href = 'node1.html';
}

function redirectToNode2() {
    window.location.href = 'node2.html';
}

function redirectToNode3() {
    window.location.href = 'node3.html';
}

function redirectToNode4() {
    window.location.href = 'node4.html';
}

function redirectToNode5() {
    window.location.href = 'node5.html';
}

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

    // Fetch data from Firebase and update the node elements
    const fetchDataAndUpdateNodes = () => {
        // Example for Node 1
        document.getElementById('tempA').innerText = '22.5°C';
        document.getElementById('humidityA').innerText = '55%';
        document.getElementById('soilA').innerText = '40%';
        document.getElementById('waterA').innerText = 'On';
        document.getElementById('fanA').innerText = 'Off';
        document.getElementById('readingA').innerText = '22:30, July 13';

        // Repeat for other nodes as necessary
        document.getElementById('tempB').innerText = '23.0°C';
        document.getElementById('humidityB').innerText = '50%';
        document.getElementById('soilB').innerText = '42%';
        document.getElementById('waterB').innerText = 'Off';
        document.getElementById('fanB').innerText = 'On';
        document.getElementById('readingB').innerText = '22:30, July 13';

        document.getElementById('tempC').innerText = '24.0°C';
        document.getElementById('humidityC').innerText = '53%';
        document.getElementById('soilC').innerText = '38%';
        document.getElementById('waterC').innerText = 'On';
        document.getElementById('fanC').innerText = 'Off';
        document.getElementById('readingC').innerText = '22:30, July 13';

        document.getElementById('tempD').innerText = '22.8°C';
        document.getElementById('humidityD').innerText = '56%';
        document.getElementById('soilD').innerText = '37%';
        document.getElementById('waterD').innerText = 'Off';
        document.getElementById('fanD').innerText = 'On';
        document.getElementById('readingD').innerText = '22:30, July 13';

        document.getElementById('tempE').innerText = '21.9°C';
        document.getElementById('humidityE').innerText = '54%';
        document.getElementById('soilE').innerText = '36%';
        document.getElementById('waterE').innerText = 'On';
        document.getElementById('fanE').innerText = 'Off';
        document.getElementById('readingE').innerText = '22:30, July 13';
    };

    // Call the function to update the nodes on page load
    fetchDataAndUpdateNodes();
});
