// Import Firebase database functions
import { database, ref, onValue, update } from "./firebase-config.js";

// Get the initial last reading date and time
const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452/data_time');
onValue(lastReadingRef, (snapshot) => {
  const data = snapshot.val();
  if (data && data.lastReading) {
    const lastReadingTime = new Date(data.lastReading);
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
});

// Initialize gauges (dummy initialization)
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

// Function to update gauges and last reading from Firebase
function updateData(snapshot) {
  const data = snapshot.val();
  if (data) {
    soilMoistureGauge.refresh(data.soilMoisture || 0);
    temperatureGauge.refresh(data.temperature || 0);
    humidityGauge.refresh(data.humidity || 0);
  }
}

// Listen for changes in Firebase
const espDataRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');
onValue(espDataRef, updateData);

function toggleWater() {
  const button = document.getElementById('water-button');
  const isWaterOn = button.innerText === 'Turn Water On';
  button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
  console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

  // Update water state in Firebase
  const waterState = isWaterOn ? 'On' : 'Off';
  update(ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452'), {
    waterState: waterState
  });
}
