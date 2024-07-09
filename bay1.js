import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase references
    const lastReadingRef = ref(database, 'Esp1/ESP_20240622030452');
    const temperatureRef = ref(database, 'Esp1/temperature');
    const soilMoistureRef = ref(database, 'Esp1/soil_moisture');
    const humidityRef = ref(database, 'Esp1/humidity');

    // Get the initial last reading date and time
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
    }, (error) => {
        console.error("Error fetching last reading time:", error);
        document.getElementById('last-reading').innerText = "Error loading data";
    });

    // Listen for changes in the temperature data
    onValue(temperatureRef, (snapshot) => {
        const temperature = snapshot.val();
        if (temperature !== null) {
            document.getElementById('temperature-box').textContent = `${temperature.toFixed(1)} °C`;
        } else {
            document.getElementById('temperature-box').textContent = "Data not available";
        }
    }, (error) => {
        console.error("Error fetching temperature:", error);
        document.getElementById('temperature-box').textContent = "Error loading data";
    });

    // Listen for changes in the soil moisture data
    onValue(soilMoistureRef, (snapshot) => {
        const soilMoisture = snapshot.val();
        if (soilMoisture !== null) {
            document.getElementById('soil-moisture-box').textContent = `${soilMoisture.toFixed(1)} %`;
        } else {
            document.getElementById('soil-moisture-box').textContent = "Data not available";
        }
    }, (error) => {
        console.error("Error fetching soil moisture:", error);
        document.getElementById('soil-moisture-box').textContent = "Error loading data";
    });
document.getElementById('hamburger-menu').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
});

    // Listen for changes in the humidity data
    onValue(humidityRef, (snapshot) => {
        const humidity = snapshot.val();
        if (humidity !== null) {
            document.getElementById('humidity-box').textContent = `${humidity.toFixed(1)} %`;
        } else {
            document.getElementById('humidity-box').textContent = "Data not available";
        }
    }, (error) => {
        console.error("Error fetching humidity:", error);
        document.getElementById('humidity-box').textContent = "Error loading data";
    });
});
