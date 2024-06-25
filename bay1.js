import { database, ref, onValue, update } from "./firebase-config.js";

// Initialize Firebase references
const waterFlowRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452/waterflow');

// Function to toggle water state
function toggleWater() {
  const button = document.getElementById('water-button');
  const isWaterOn = button.innerText === 'Turn Water On';
  button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
  console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

  // Update water state directly in Firebase
  update(waterFlowRef, {
    waterState: isWaterOn ? 1 : 0
  });
}

// Listen for changes in Firebase (if needed)
onValue(waterFlowRef, (snapshot) => {
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
// ... (rest of the gauge initialization code)

// Function to update gauges from Firebase data
function updateData(data) {
  if (data) {
    soilMoistureGauge.refresh(data.soilMoisture || 0);
    temperatureGauge.refresh(data.temperature || 0);
    humidityGauge.refresh(data.humidity || 0);
  }
}

console.log("Snapshot value (ESP data):", snapshot.val());
console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);
