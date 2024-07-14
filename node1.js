import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Firebase data fetching for Node 1
  const node1TemperatureRef = ref(database, 'bay 1/node 1/temperature');
  const node1SoilMoistureRef = ref(database, 'bay 1/node 1/soil_moisture');
  const node1HumidityRef = ref(database, 'bay 1/node 1/humidity');

  const updateNode1Values = (elementId, value) => {
    const element = document.getElementById(elementId);
    if (value !== null) {
      element.textContent = `${value.toFixed(1)} ${elementId === 'temperature-box' ? '°C' : '%'}`;
    } else {
      element.textContent = "Data not available";
    }
  };

  onValue(node1TemperatureRef, (snapshot) => {
    const temperature = snapshot.val();
    updateNode1Values('temperature-box', temperature);
  }, (error) => {
    console.error("Error fetching temperature:", error);
    updateNode1Values('temperature-box', null);
  });

  onValue(node1SoilMoistureRef, (snapshot) => {
    const soilMoisture = snapshot.val();
    updateNode1Values('soil-moisture-box', soilMoisture);
  }, (error) => {
    console.error("Error fetching soil moisture:", error);
    updateNode1Values('soil-moisture-box', null);
  });

  onValue(node1HumidityRef, (snapshot) => {
    const humidity = snapshot.val();
    updateNode1Values('humidity-box', humidity);
  }, (error) => {
    console.error("Error fetching humidity:", error);
    updateNode1Values('humidity-box', null);
  });

  // Control panel adjustments
  const waterPumpDropdown = document.getElementById('water-pump-dropdown');
  const fansDropdown = document.getElementById('fans-dropdown');

  const waterPumpOptions = waterPumpDropdown.querySelectorAll('option');
  const fansOptions = fansDropdown.querySelectorAll('option');

  waterPumpDropdown.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    // Implement logic to control the water pump based on selected value
    console.log('Water Pump:', selectedValue);
  });

  fansDropdown.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    // Implement logic to control the fans based on selected value
    console.log('Fans:', selectedValue);
  });

  // Adjust sidebar contents alignment
  const waterPumpLabel = document.querySelector('.control-panel label[for="water-pump-dropdown"]');
  waterPumpLabel.textContent = 'Water Pump';

  const fansLabel = document.querySelector('.control-panel label[for="fans-dropdown"]');
  fansLabel.textContent = 'Fans';

  const sidebarContent = document.querySelector('.sidebar .content');
  sidebarContent.style.display = 'flex';
  sidebarContent.style.flexDirection = 'column';
  sidebarContent.style.alignItems = 'center';

});
