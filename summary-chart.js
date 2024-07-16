document.addEventListener('DOMContentLoaded', () => {
  const summaryCanvas = document.getElementById('summary-chart');
  if (summaryCanvas) {
      const summaryCtx = summaryCanvas.getContext('2d');
      const summaryChart = new Chart(summaryCtx, {
          type: 'line',
          data: {
              labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
              datasets: [
                  {
                      label: 'Temperature (°C)',
                      data: [30, 25, 28, 26, 27, 29, 32],
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderWidth: 2,
                      fill: false,
                      tension: 0.4
                  },
                  {
                      label: 'Humidity (%)',
                      data: [60, 65, 62, 68, 70, 65, 63],
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      borderWidth: 2,
                      fill: false,
                      tension: 0.4
                  },
                  {
                      label: 'Soil Moisture (%)',
                      data: [40, 38, 42, 45, 43, 41, 39],
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
                      grid: {
                          display: false
                      }
                  },
                  y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                          stepSize: 20
                      }
                  }
              },
              plugins: {
                  legend: {
                      position: 'top',
                  },
                  title: {
                      display: false
                  }
              },
              elements: {
                  point: {
                      radius: 4,
                      hoverRadius: 6
                  }
              }
          }
      });
  }
});