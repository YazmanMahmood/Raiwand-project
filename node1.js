import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      hamburger.style.left = '215px';
    } else {
      hamburger.style.left = '15px';
    }
  });

  // Close sidebar when clicking outside
  mainContent.addEventListener('click', () => {
    if (sidebar.classList.contains('open') && window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.style.left = '15px';
    }
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
  const waterPumpSlider = document.getElementById('water-pump-slider');
  const fansSlider = document.getElementById('fans-slider');

  waterPumpSlider.addEventListener('input', (event) => {
    const selectedValue = event.target.value;
    console.log('Water Pump:', selectedValue);
    // Implement logic to control the water pump based on selected value
  });

  fansSlider.addEventListener('input', (event) => {
    const selectedValue = event.target.value;
    console.log('Fans:', selectedValue);
    // Implement logic to control the fans based on selected value
  });

  // Modify chart size
  const summaryChartCanvas = document.getElementById('summary-chart');
  summaryChartCanvas.style.width = '100%';
  summaryChartCanvas.style.height = '100%';

  // Ensure chart resizes with container
  window.addEventListener('resize', () => {
    if (window.summaryChart) {
      window.summaryChart.resize();
    }
  });

  // Dropdown functionality
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownContainer = document.querySelector('.dropdown-container');

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownBtn.classList.toggle('active');
    dropdownContainer.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-container')) {
      dropdownContainer.classList.remove('show');
      dropdownBtn.classList.remove('active');
    }
  });

  // Redirect on dropdown item click
  const dropdownLinks = document.querySelectorAll('.dropdown-container a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.stopPropagation();
      window.location.href = event.target.getAttribute('href');
    });
  });

  // Update layout on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.style.left = '15px';
      mainContent.style.marginLeft = '200px';
    } else {
      mainContent.style.marginLeft = '0';
    }
  });
});