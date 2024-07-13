// firebase-config.js

import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Firebase initialization and data fetching
  const temperatureRef = ref(database, 'bay 1/node 1/temperature');
  const soilMoistureRef = ref(database, 'bay 1/node 1/soil_moisture');
  const humidityRef = ref(database, 'bay 1/node 1/humidity');

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
});