// Create a bar chart with random values for temperature, humidity, and soil moisture

document.addEventListener("DOMContentLoaded", function() {
  const ctx = document.getElementById('summary-chart').getContext('2d');

  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Temperature (℃)',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 15) + 10),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Humidity (%)',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 30),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Soil Moisture (%)',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 60),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
});
