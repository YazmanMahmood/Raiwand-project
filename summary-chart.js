document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('summary-chart').getContext('2d');
    
    // Initialize data arrays
    const labels = [];
    const temperatureData = [];
    const humidityData = [];
    const soilMoistureData = [];

    // Create the chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Soil Moisture (%)',
                    data: soilMoistureData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Live Sensor Data'
                }
            }
        }
    });

    // Function to update chart data
    function updateChartData(newData) {
        const now = new Date();
        
        labels.push(now);
        temperatureData.push(newData.temperature);
        humidityData.push(newData.humidity);
        soilMoistureData.push(newData.soil_moisture);

        // Remove data older than 1 minute
        const oneMinuteAgo = now.getTime() - 60 * 1000;
        while (labels.length > 0 && labels[0] < oneMinuteAgo) {
            labels.shift();
            temperatureData.shift();
            humidityData.shift();
            soilMoistureData.shift();
        }

        chart.update();
    }

    // Expose the updateChartData function globally
    window.updateChartData = updateChartData;
});
