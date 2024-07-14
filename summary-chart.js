document.addEventListener('DOMContentLoaded', () => {
    const summaryCanvas = document.getElementById('summary-chart');
    if (summaryCanvas) {
        const summaryCtx = summaryCanvas.getContext('2d');
        const summaryChart = new Chart(summaryCtx, {
            type: 'line', // Changed from 'bar' to 'line'
            data: {
                labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
                datasets: [{
                    label: 'Temperature',
                    data: [30, 25, 28, 26, 27, 29, 32],
                    borderColor: 'rgba(26, 188, 156, 1)',
                    backgroundColor: 'rgba(26, 188, 156, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4 // This adds a slight curve to the line
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
});
