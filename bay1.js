// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmVSOm8g6p4F3ZY4jxIEUTQH_oFllo1hg",
  authDomain: "greenhouse-raiwind.firebaseapp.com",
  databaseURL: "https://greenhouse-raiwind-default-rtdb.firebaseio.com",
  projectId: "greenhouse-raiwind",
  storageBucket: "greenhouse-raiwind.appspot.com",
  messagingSenderId: "338760023791",
  appId: "1:338760023791:web:667a022e8b69459eb2651a",
  measurementId: "G-CPD0XFLYN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get the database instance

// Set the initial last reading date and time
const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452/data_time');
onValue(lastReadingRef, (snapshot) => {
  const data = snapshot.val();
  const lastReadingTime = new Date(data.lastReading);
  document.getElementById('last-reading').innerText = lastReadingTime.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

// Function to update gauges and last reading from Firebase
function updateData(snapshot) {
  const data = snapshot.val();
  soilMoistureGauge.refresh(data.soilMoisture);
  temperatureGauge.refresh(data.temperature);
  humidityGauge.refresh(data.humidity);

  // You can update other UI elements based on 'data' here if needed
}

// Listen for changes in Firebase
const espDataRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');
onValue(espDataRef, updateData);

function toggleWater() {
  const button = document.getElementById('water-button');
  const isWaterOn = button.innerText === 'Turn Water On';
  button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
  console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

  // Update water state in Firebase (dummy implementation)
  const waterState = isWaterOn ? 'On' : 'Off';
  update(ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452'), {
    waterState: waterState
  });
}
