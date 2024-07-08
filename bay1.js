// Import Firebase modules and configurations
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
  // Your Firebase project config here
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase database service
const database = getDatabase(app);

// Function to format date and time
function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Function to handle Firebase data updates
function handleDataUpdate(elementId, snapshot) {
  const element = document.getElementById(elementId);
  const data = snapshot.val();
  if (data !== null) {
    element.innerText = `${data.toFixed(1)} %`;
  } else {
    element.innerText = 'Data not available';
  }
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  // Firebase references
  const temperatureRef = ref(database, 'https://greenhouse-raiwind-default-rtdb.firebaseio.com/Esp1/temperature');
  const soilMoistureRef = ref(database, 'https://greenhouse-raiwind-default-rtdb.firebaseio.com/Esp1/soil_moisture');
  const humidityRef = ref(database, 'https://greenhouse-raiwind-default-rtdb.firebaseio.com/Esp1/humidity');
  const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');

  // Fetch and display last reading time
  onValue(lastReadingRef, (snapshot) => {
    const lastReadingTime = snapshot.val().data_time;
    const formattedDateTime = formatDateTime(lastReadingTime);
    document.getElementById('last-reading').innerText = `Last Reading as of ${formattedDateTime}`;
  });

  // Listen for changes in temperature
  onValue(temperatureRef, (snapshot) => {
    handleDataUpdate('temperature-box', snapshot);
  });

  // Listen for changes in soil moisture
  onValue(soilMoistureRef, (snapshot) => {
    handleDataUpdate('soil-moisture-box', snapshot);
  });

  // Listen for changes in humidity
  onValue(humidityRef, (snapshot) => {
    handleDataUpdate('humidity-box', snapshot);
  });
});
