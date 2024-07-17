import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    hamburger: document.querySelector('.hamburger'),
    sidebar: document.querySelector('.sidebar'),
    mainContent: document.querySelector('.main-content'),
    dropdownBtn: document.querySelector('.dropdown-btn'),
    dropdownContainer: document.querySelector('.dropdown-container'),
    waterPumpSlider: document.getElementById('water-pump-slider'),
    fansSlider: document.getElementById('fans-slider'),
    lastReading: document.getElementById('last-reading')
  };

  function updateGauge(gaugeId, valueId, value, min, max, unit) {
    const gauge = document.getElementById(gaugeId);
    const valueDisplay = document.getElementById(valueId);
    const valueTextbox = document.getElementById(`${valueId}-textbox`);
    
    if (gauge && valueDisplay && valueTextbox && value !== null) {
      const percentage = ((value - min) / (max - min)) * 100;
      const dashOffset = 565.48 - (565.48 * percentage / 100);
      gauge.style.strokeDashoffset = dashOffset;
      const formattedValue = `${value.toFixed(1)}${unit}`;
      valueDisplay.textContent = formattedValue;
      valueTextbox.textContent = formattedValue;
    } else {
      console.error(`Unable to update gauge: ${gaugeId}`);
    }
  }

  function updateLastReadingTime() {
    if (elements.lastReading) {
      elements.lastReading.textContent = new Date().toLocaleString();
    }
  }

  function setupFirebaseListener(path, gaugeId, valueId, unit) {
    const dataRef = ref(database, path);
    onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      updateGauge(gaugeId, valueId, value, 0, 100, unit);
      updateLastReadingTime();
    }, (error) => {
      console.error(`Error fetching ${path}:`, error);
    });
  }

  setupFirebaseListener('bay 1/node 1/temperature', 'temperature-gauge', 'temperature-value', '°C');
  setupFirebaseListener('bay 1/node 1/soil_moisture', 'soil-moisture-gauge', 'soil-moisture-value', '%');
  setupFirebaseListener('bay 1/node 1/humidity', 'humidity-gauge', 'humidity-value', '%');

  if (elements.hamburger && elements.sidebar) {
    elements.hamburger.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
      elements.hamburger.classList.toggle('open');
      elements.hamburger.style.left = elements.sidebar.classList.contains('open') ? '215px' : '15px';
    });
  }

  if (elements.mainContent && elements.sidebar) {
    elements.mainContent.addEventListener('click', () => {
      if (elements.sidebar.classList.contains('open') && window.innerWidth <= 768) {
        elements.sidebar.classList.remove('open');
        elements.hamburger.classList.remove('open');
        elements.hamburger.style.left = '15px';
      }
    });
  }

  if (elements.dropdownBtn && elements.dropdownContainer) {
    elements.dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.dropdownBtn.classList.toggle('active');
      elements.dropdownContainer.classList.toggle('show');
    });
  }

  document.addEventListener('click', (event) => {
    if (elements.dropdownContainer && elements.dropdownBtn && 
        !event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-container')) {
      elements.dropdownContainer.classList.remove('show');
      elements.dropdownBtn.classList.remove('active');
    }
  });

  const dropdownLinks = document.querySelectorAll('.dropdown-container a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.stopPropagation();
      window.location.href = event.target.getAttribute('href');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (elements.sidebar) elements.sidebar.classList.remove('open');
      if (elements.hamburger) {
        elements.hamburger.classList.remove('open');
        elements.hamburger.style.left = '15px';
      }
      if (elements.mainContent) elements.mainContent.style.marginLeft = '200px';
    } else {
      if (elements.mainContent) elements.mainContent.style.marginLeft = '0';
    }
  });

  // Initial gauge setup
  updateGauge('temperature-gauge', 'temperature-value', 0, 0, 100, '°C');
  updateGauge('soil-moisture-gauge', 'soil-moisture-value', 0, 0, 100, '%');
  updateGauge('humidity-gauge', 'humidity-value', 0, 0, 100, '%');
});
