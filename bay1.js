import { database, ref, onValue, update } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase references
    const waterFlowRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030456');
    const waterFlowCounterRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452/waterflow');
    const lastReadingRef = ref(database, 'GreenHouse Raiwind/ESP1/ESP_20240622030452');
    const temperatureRef = ref(database, 'GreenHouse Raiwind/ESP1/temperature');

    // Initialize click count
    let clickCount = 0;

    // Function to update click count and Firebase on button click
    function handleWaterButtonClick() {
        clickCount++;

        // Update button text
        const button = document.getElementById('water-button');
        button.innerText = `Water Clicks: ${clickCount}`;

        // Update Firebase with new click count
        update(waterFlowRef, {
            water_flow: clickCount,
            waterState: clickCount % 2 === 1 ? 1 : 0 // Example of updating water state
        });

        // Update waterflow in another location
        update(waterFlowCounterRef, {
            waterflow: clickCount
        });
    }

    // Add event listener to the water button
    document.getElementById('water-button').addEventListener('click', handleWaterButtonClick);

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
            updateData(data); // Update gauges with initial data
        } else {
            document.getElementById('last-reading').innerText = "Data not available";
        }
    });

    onValue(temperatureRef, (snapshot) => {
        const temperature = snapshot.val();
        if (temperature !== null) {
            // Update the temperature gauge
            temperatureGauge.refresh(temperature);
        }
    });

   // Listen for changes in the temperature data
   onValue(temperatureRef, (snapshot) => {
    const temperature = snapshot.val();
    if (temperature !== null) {
        // Update the temperature gauge
        updateTemperatureGauge(temperature);
    }
});

// Function to update the temperature gauge
function updateTemperatureGauge(temperature) {
    // Update the gauge value
    document.getElementById('temperature').textContent = temperature.toFixed(1);

    // Calculate the angle for the gauge (assuming 0-50°C range)
    const angle = (temperature / 50) * 280;
    const dashArray = `${angle} ${280 - angle}`;

    // Update the SVG path
    const path = document.querySelector('#temperature-gauge svg path');
    path.style.strokeDasharray = dashArray;
}


    // Function to update gauges from Firebase data
    function updateData(data) {
        if (data) {
            soilMoistureGauge.refresh(data.soilMoisture || 0);
            temperatureGauge.refresh(data.temperature || 0);
            humidityGauge.refresh(data.humidity || 0);
        }
    }

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
});
