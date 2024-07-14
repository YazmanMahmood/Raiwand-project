import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Firebase initialization and data fetching
  const bay1Dropdown = document.getElementById('bay1-dropdown');
  const bay1DropdownContent = document.getElementById('bay1-dropdown-content');

  bay1Dropdown.addEventListener('click', () => {
    bay1DropdownContent.classList.toggle('open');
  });

  bay1DropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      const nodeLink = event.target.getAttribute('href');
      if (nodeLink) {
        window.location.href = nodeLink;
      }
    }
  });

  // Firebase data fetching
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

  // Change 'Manual' to 'On' and remove dropdown below
  const manualLabel = document.querySelector('.control-panel label[for="water-pump-slider"]');
  manualLabel.textContent = 'On'; // Change label text

  const manualDropdown = document.getElementById('water-pump-dropdown');
  manualDropdown.style.display = 'none'; // Hide the dropdown

  // Event listener for selecting options in dropdowns
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
