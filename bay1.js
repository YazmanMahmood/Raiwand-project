import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');

    // Function to toggle sidebar and hamburger menu
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('open');
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

    const updateValue = (elementId, value) => {
        const element = document.getElementById(elementId);
        if (value !== null) {
            element.textContent = `${value.toFixed(1)} ${elementId === 'temperature-box' ? '°C' : '%'}`;
        } else {
            element.textContent = "Data not available";
        }
    };

    onValue(temperatureRef, (snapshot) => {
        const temperature = snapshot.val();
        updateValue('temperature-box', temperature);
    }, (error) => {
        console.error("Error fetching temperature:", error);
        updateValue('temperature-box', null);
    });

    onValue(soilMoistureRef, (snapshot) => {
        const soilMoisture = snapshot.val();
        updateValue('soil-moisture-box', soilMoisture);
    }, (error) => {
        console.error("Error fetching soil moisture:", error);
        updateValue('soil-moisture-box', null);
    });

    onValue(humidityRef, (snapshot) => {
        const humidity = snapshot.val();
        updateValue('humidity-box', humidity);
    }, (error) => {
        console.error("Error fetching humidity:", error);
        updateValue('humidity-box', null);
    });

    // Control panel functionality
    const waterPumpSlider = document.getElementById('water-pump-slider');
    const fansSlider = document.getElementById('fans-slider');
    const waterPumpDropdown = document.getElementById('water-pump-dropdown');
    const fansDropdown = document.getElementById('fans-dropdown');

    waterPumpSlider.addEventListener('input', () => {
        const value = waterPumpSlider.value;
        waterPumpDropdown.style.display = value === '1' ? 'block' : 'none';
    });

    fansSlider.addEventListener('input', () => {
        const value = fansSlider.value;
        fansDropdown.style.display = value === '1' ? 'block' : 'none';
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

    // Function to hide sidebar on smaller screens
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    function handleTabletChange(e) {
        if (e.matches) {
            sidebar.classList.remove('open');
            hamburger.classList.remove('open');
        } else {
            sidebar.classList.add('open');
        }
    }
    mediaQuery.addListener(handleTabletChange);
    handleTabletChange(mediaQuery);

});
