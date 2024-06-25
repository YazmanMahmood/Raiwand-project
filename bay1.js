import { database, ref, onValue, update } from "./firebase-config.js";

// Initialize Firebase references
const waterFlowRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030456');
const waterFlowCounterRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452/waterflow');

// Initialize click count
let clickCount = 0;

// Function to update click count and Firebase on button click
function handleWaterButtonClick() {
  clickCount++;

  // Update button text
  const button = document.getElementById('water-button');
  button.innerText = `Water Clicks: ${clickCount}`;

  // Update Firebase with new click count
  update(waterFlowRef, {
    water_flow: clickCount,
    waterState: clickCount % 2 === 1 ? 1 : 0  // Example of updating water state
  });

  // Update waterflow in another location
  update(waterFlowCounterRef, {
    waterflow: clickCount
  });
}

// Add event listener to the water button
document.getElementById('water-button').addEventListener('click', handleWaterButtonClick);

// Get the initial last reading date and time
const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');

onValue(lastReadingRef, (snapshot) => {
  const data = snapshot.val();
  if (data && data.data_time) {
    const lastReadingTime = new Date(data.data_time);
    document.getElementById('last-reading').innerText = lastReadingTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } else {
    document.getElementById('last-reading').innerText = "Data not available";
  }
  updateData(data);
});

// Function to update gauges from Firebase data
function updateData(data) {
  if (data) {
    soilMoistureGauge.refresh(data.soilMoisture || 0);
    temperatureGauge.refresh(data.temperature || 0);
    humidityGauge.refresh(data.humidity || 0);
  }
}

// Initialize gauges (dummy initialization)
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
