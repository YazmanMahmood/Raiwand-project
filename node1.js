import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    hamburger: document.querySelector('.hamburger'),
    sidebar: document.querySelector('.sidebar'),
    mainContent: document.querySelector('.main-content'),
    lastReading: document.getElementById('last-reading'),
    popup: document.getElementById('popup'),
    popupMessage: document.getElementById('popup-message'),
    popupClose: document.getElementById('popup-close'),
    chartContainer: document.getElementById('summary-chart-container')
  };

  let latestData = {
    temperature: 0,
    humidity: 0,
    soil_moisture: 0
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

  function updateSetValueIndicator(gaugeId, value, min, max) {
    const setValueGauge = document.getElementById(`${gaugeId}-set-value`);
    if (setValueGauge && value !== null) {
      const percentage = ((value - min) / (max - min)) * 100;
      const dashOffset = 565.48 - (565.48 * percentage / 100);
      setValueGauge.style.strokeDashoffset = dashOffset;
    }
  }

  function updateLastReadingTime() {
    if (elements.lastReading) {
      elements.lastReading.textContent = new Date().toLocaleString();
    }
  }

  function updateChartPosition(temperature, humidity, soilMoisture) {
    const maxPosition = window.innerHeight - elements.chartContainer.offsetHeight;
    const avgValue = (temperature + humidity + soilMoisture) / 3;
    const newPosition = maxPosition * (1 - avgValue / 100);
    elements.chartContainer.style.top = `${newPosition}px`;
    
    // Update the chart data
    if (window.updateChartData) {
      window.updateChartData(latestData);
    }
  }

  function setupFirebaseListener(path, gaugeId, valueId, unit) {
    const dataRef = ref(database, path);
    onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        updateGauge(gaugeId, valueId, value, 0, 100, unit);
        
        // Update latestData
        latestData[path.split('/').pop()] = value;
        
        // Call updateChartPosition with all latest data
        updateChartPosition(latestData.temperature, latestData.humidity, latestData.soil_moisture);
        
        updateLastReadingTime();
      }
    }, (error) => {
      console.error(`Error fetching ${path}:`, error);
    });

    const setValueRef = ref(database, `bay 1/node 1/set values/${path.split('/').pop()}`);
    onValue(setValueRef, (snapshot) => {
      const setValue = snapshot.val();
      if (setValue !== null) {
        updateSetValueIndicator(gaugeId, setValue, 0, 100);
      }
    }, (error) => {
      console.error(`Error fetching set value:`, error);
    });
  }

  setupFirebaseListener('bay 1/node 1/temperature', 'temperature-gauge', 'temperature-value', '°C');
  setupFirebaseListener('bay 1/node 1/soil_moisture', 'soil-moisture-gauge', 'soil-moisture-value', '%');
  setupFirebaseListener('bay 1/node 1/humidity', 'humidity-gauge', 'humidity-value', '%');

  function showPopup(message) {
    elements.popupMessage.textContent = message;
    elements.popup.style.display = 'block';
  }

  function hidePopup() {
    elements.popup.style.display = 'none';
  }

  elements.popupClose.addEventListener('click', hidePopup);

  // Sidebar functionality
  elements.hamburger.addEventListener('click', () => {
    elements.sidebar.classList.toggle('open');
    elements.mainContent.classList.toggle('shifted');
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (event) => {
    if (!elements.sidebar.contains(event.target) && !elements.hamburger.contains(event.target)) {
      elements.sidebar.classList.remove('open');
      elements.mainContent.classList.remove('shifted');
    }
  });

  // Set value functionality with validation
  function setupSetValueButton(buttonId, inputId, path, valueName) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (button && input) {
      button.addEventListener('click', () => {
        let setValue = parseFloat(input.value);
        if (!isNaN(setValue) && setValue >= 0 && setValue <= 100) {
          const setValueRef = ref(database, path);
          set(setValueRef, setValue)
            .then(() => {
              showPopup(`Set ${valueName} updated to ${setValue}`);
              input.value = ''; // Clear the text box
            })
            .catch((error) => showPopup(`Error updating ${valueName}: ${error.message}`));
        } else {
          showPopup('Please enter a valid number (0-100)');
        }
      });
    } else {
      console.error(`Button ${buttonId} or input ${inputId} not found`);
    }
  }

  setupSetValueButton('set-temperature', 'temperature-input', 'bay 1/node 1/set values/temperature', 'temperature');
  setupSetValueButton('set-humidity', 'humidity-input', 'bay 1/node 1/set values/humidity', 'humidity');
  setupSetValueButton('set-soil-moisture', 'soil-moisture-input', 'bay 1/node 1/set values/soil_moisture', 'soil moisture');

  // Mobile responsiveness improvements
  function adjustForMobile() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);

    if (isMobile) {
      elements.sidebar.classList.remove('open');
      elements.mainContent.classList.remove('shifted');
    }
  }

  window.addEventListener('resize', adjustForMobile);
  adjustForMobile(); // Call once on load

  // Fetch initial set values and update inputs
  function fetchInitialSetValues() {
    const setValuePaths = [
      'bay 1/node 1/set values/temperature',
      'bay 1/node 1/set values/humidity',
      'bay 1/node 1/set values/soil_moisture'
    ];

    setValuePaths.forEach(path => {
      get(ref(database, path)).then((snapshot) => {
        const setValue = snapshot.val();
        if (setValue !== null) {
          const inputId = `${path.split('/').pop()}-input`;
          const inputElement = document.getElementById(inputId);
          if (inputElement) {
            inputElement.value = setValue;
          }
        }
      }).catch((error) => console.error(`Error fetching initial set value for ${path}:`, error));
    });
  }

  fetchInitialSetValues();

  // Set initial position for chart container
  elements.chartContainer.style.position = 'relative';
  elements.chartContainer.style.top = '0px';

  // Dropdown functionality
  function setupDropdown() {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach((dropdownBtn) => {
        const dropdownContainer = dropdownBtn.nextElementSibling;

        if (dropdownBtn && dropdownContainer) {
            dropdownBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                dropdownContainer.classList.toggle('show');
            });
        }
    });
}

  setupDropdown();

  // Modern button functionality
  document.querySelectorAll('.modern-button').forEach(function(button) {
    button.addEventListener('click', function() {
      this.classList.toggle('bright');
    });
  });
});
