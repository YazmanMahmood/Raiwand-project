// Import Firebase database functions
import { database, ref, onValue, update } from "./firebase-config.js";

// Initialize Firebase references
const waterFlowRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030456/water_flow');

// Function to toggle water state and count clicks
let clickCount = 0;

function toggleWater() {
  clickCount++;
  const button = document.getElementById('water-button');
  const isWaterOn = button.innerText === 'Turn Water On';
  button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
  console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

  // Update water state in Firebase
  const waterState = isWaterOn ? 1 : 0; // Change here to send 1 or 0
  update(ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452'), {
    waterState: waterState
  });

  // Update click count in Firebase
  update(waterFlowRef, {
    clickCount: clickCount
  });
}

// Listen for changes in Firebase (if needed)
onValue(waterFlowRef, (snapshot) => {
  const data = snapshot.val();
  if (data && data.clickCount) {
    clickCount = data.clickCount;
  } else {
    clickCount = 0; // Initialize click count if not available
  }
  console.log(`Current click count: ${clickCount}`);
});

// Get the initial last reading date and time
const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');
onValue(lastReadingRef, (snapshot) => {
  console.log("Snapshot value (ESP data):", snapshot.val()); // Debugging
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

// Function to update gauges from Firebase data
function updateData(data) {
  console.log("Update data:", data); // Debugging
  if (data) {
    soilMoistureGauge.refresh(data.soilMoisture || 0);
    temperatureGauge.refresh(data.temperature || 0);
    humidityGauge.refresh(data.humidity || 0);
  }
}
