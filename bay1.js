import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Firebase initialization and data fetching
    const lastReadingRef = ref(database, 'Esp1/ESP_20240622030452');
    const temperatureRef = ref(database, 'Esp1/temperature');
    const soilMoistureRef = ref(database, 'Esp1/soil_moisture');
    const humidityRef = ref(database, 'Esp1/humidity');

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

    // Control panel functionality
    const waterPumpSlider = document.getElementById('water-pump-slider');
    const fansSlider = document.getElementById('fans-slider');
    const waterPumpDropdown = document.getElementById('water-pump-dropdown');
    const fansDropdown = document.getElementById('fans-dropdown');

    waterPumpSlider.addEventListener('input', () => {
        const value = waterPumpSlider.value;
        if (value === '1') {
            waterPumpDropdown.style.display = 'block';
        } else {
            waterPumpDropdown.style.display = 'none';
        }
    });

    fansSlider.addEventListener('input', () => {
        const value = fansSlider.value;
        if (value === '1') {
            fansDropdown.style.display = 'block';
        } else {
            fansDropdown.style.display = 'none';
        }
    });

    waterPumpDropdown.querySelector('select').addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        // Implement logic to control the water pump
        console.log('Water Pump:', selectedValue);
    });

    fansDropdown.querySelector('select').addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        // Implement logic to control the fans
        console.log('Fans:', selectedValue);
    });
});
