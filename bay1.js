document.addEventListener('DOMContentLoaded', () => {
    // Function to redirect to node page
    const redirectToNode = (nodePage) => {
        window.location.href = nodePage;
    };

    // Sample data simulation (replace with Firebase or actual data)
    const nodesData = [
        {
            id: 'node1',
            name: 'Node 1',
            temperature: '22.5°C',
            humidity: '55%',
            soilMoisture: '40%'
        },
        {
            id: 'node2',
            name: 'Node 2',
            temperature: '23.0°C',
            humidity: '50%',
            soilMoisture: '42%'
        },
        {
            id: 'node3',
            name: 'Node 3',
            temperature: '21.5°C',
            humidity: '60%',
            soilMoisture: '38%'
        },
        {
            id: 'node4',
            name: 'Node 4',
            temperature: '22.0°C',
            humidity: '57%',
            soilMoisture: '41%'
        },
        {
            id: 'node5',
            name: 'Node 5',
            temperature: '23.2°C',
            humidity: '52%',
            soilMoisture: '39%'
        },
        {
            id: 'node6',
            name: 'Node 6',
            temperature: '21.8°C',
            humidity: '58%',
            soilMoisture: '37%'
        }
    ];

    // Update node information in the HTML
    nodesData.forEach(node => {
        const nodeElement = document.getElementById(node.id);
        if (nodeElement) {
            nodeElement.addEventListener('click', () => {
                redirectToNode(`${node.id}.html`);
            });
            nodeElement.querySelector('#temp').innerText = node.temperature;
            nodeElement.querySelector('#humidity').innerText = node.humidity;
            nodeElement.querySelector('#soil').innerText = node.soilMoisture;
        });
    });

    // Example chart initialization (replace with your actual implementation)
    const summaryChartCanvas = document.getElementById('summary-chart');
    if (summaryChartCanvas) {
        const summaryCtx = summaryChartCanvas.getContext('2d');
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

    // Example gauge initialization (replace with your actual implementation)
    const createGauge = (id, value, title, label) => {
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
