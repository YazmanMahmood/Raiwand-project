import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase references
    const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');
    const temperatureRef = ref(database, 'GreenHouse Raiwind/Esp1/temperature');
    const soilMoistureRef = ref(database, 'GreenHouse Raiwind/Esp1/soil_moisture');
    const humidityRef = ref(database, 'GreenHouse Raiwind/Esp1/humidity');

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
    });

    // Listen for changes in the temperature data
    onValue(temperatureRef, (snapshot) => {
        const temperature = snapshot.val();
        if (temperature !== null) {
            document.getElementById('temperature-box').textContent = `${temperature.toFixed(1)} °C`;
        }
    });

    // Listen for changes in the soil moisture data
    onValue(soilMoistureRef, (snapshot) => {
        const soilMoisture = snapshot.val();
        if (soilMoisture !== null) {
            document.getElementById('soil-moisture-box').textContent = `${soilMoisture.toFixed(1)} %`;
        }
    });
onValue(temperatureRef, (snapshot) => {
        console.log("Temperature data:", snapshot.val());
    }, (error) => {
        console.error("Error fetching temperature:", error);
    });
    // Listen for changes in the humidity data
    onValue(humidityRef, (snapshot) => {
        const humidity = snapshot.val();
        if (humidity !== null) {
            document.getElementById('humidity-box').textContent = `${humidity.toFixed(1)} %`;
        }
    });
});
