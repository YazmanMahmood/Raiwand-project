document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to update gauges and last reading from Firebase
function updateData(snapshot) {
    const data = snapshot.val();
    soilMoistureGauge.refresh(data.soilMoisture);
    temperatureGauge.refresh(data.temperature);
    humidityGauge.refresh(data.humidity);

    const lastReadingTime = new Date(data.lastReading);
    document.getElementById('last-reading').innerText = lastReadingTime.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Listen for changes in Firebase
database.ref('bay1').on('value', updateData);

// Function to toggle water state
function toggleWater() {
    const button = document.getElementById('water-button');
    const isWaterOn = button.innerText === 'Turn Water On';
    button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
    console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

    // Update water state in Firebase
    firebase.database().ref('bay1/water').set(isWaterOn);
}

// Create gauges
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
