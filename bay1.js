// bay1.js

import { database } from "./firebase-config.js";
import JustGage from "https://cdn.jsdelivr.net/npm/justgage@1.4.0/dist/justgage.min.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

// Firebase references
const waterFlowRef = database.ref('GreenHouse Raiwind/ESP1/ESP_20240622030456/water flow');
let clickCount = 0;

// Function to toggle water state and count clicks
function toggleWater() {
  clickCount++;
  const button = document.getElementById('water-button');
  const isWaterOn = button.innerText === 'Turn Water On';
  button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
  console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

  waterFlowRef.set({
    water_flow: clickCount,
    waterState: isWaterOn ? 1 : 0
  });
}

// Listen for changes in Firebase (if needed)
waterFlowRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data && data.water_flow) {
    clickCount = data.water_flow;
  } else {
    clickCount = 0; // Initialize click count if not available
  }
  console.log(`Current click count: ${clickCount}`);
});

// Dummy initialization for gauges (replace with actual Firebase data)
const soilMoistureGauge = new JustGage({
  id: "soil-moisture-gauge",
  value: 0,
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
  value: 0,
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
  value: 0,
  min: 0,
  max: 100,
  title: "Humidity",
  label: "%",
  pointer: true,
  gaugeWidthScale: 0.6,
  levelColors: ["#00ff00", "#ff0000"]
});

// Function to update gauges with Firebase data
function updateGauges(data) {
  if (data) {
    soilMoistureGauge.refresh(data.soilMoisture || 0);
    temperatureGauge.refresh(data.temperature || 0);
    humidityGauge.refresh(data.humidity || 0);
  }
}

// Dummy initialization for chart (replace with actual Firebase data)
const ctx = document.getElementById('summary-chart').getContext('2d');
const summaryChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature',
      borderColor: 'rgb(255, 99, 132)',
      data: [],
      fill: false,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Summary'
      }
    }
  }
});

// Function to update chart with Firebase data
function updateChart(data) {
  // Update chart datasets with new data
}

// Initialize Firebase listeners for updates (if needed)
// Example:
// const dataRef = database.ref('your/data/path');
// dataRef.on('value', (snapshot) => {
//   const data = snapshot.val();
//   updateGauges(data);
//   updateChart(data);
// });

// Initial setup (dummy data)
updateGauges({});
updateChart({});

// Get the initial last reading date and time
const lastReadingRef = database.ref('GreenHouse Raiwind/ESP1/ESP_20240622030452');
lastReadingRef.once('value', (snapshot) => {
  const data = snapshot.val();
  if (data && data.data_time) {
    const lastReadingTime = new Date(data.data_time);
    document.getElementById('last-reading').innerText = lastReadingTime.toLocaleString('en-US', {
