document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('#hamburger-menu');
  const sidebar = document.querySelector('#sidebar');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Firebase initialization and data fetching
  const lastReadingRef = firebase.database().ref('Esp1/ESP_20240622030452');
  const temperatureRef = firebase.database().ref('Esp1/temperature');
  const soilMoistureRef = firebase.database().ref('Esp1/soil_moisture');
  const humidityRef = firebase.database().ref('Esp1/humidity');

  lastReadingRef.on('value', (snapshot) => {
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

  temperatureRef.on('value', (snapshot) => {
    const temperature = snapshot.val();
    updateValue('temperature-box', temperature);
  }, (error) => {
    console.error("Error fetching temperature:", error);
    updateValue('temperature-box', null);
  });

  soilMoistureRef.on('value', (snapshot) => {
    const soilMoisture = snapshot.val();
    updateValue('soil-moisture-box', soilMoisture);
  }, (error) => {
    console.error("Error fetching soil moisture:", error);
    updateValue('soil-moisture-box', null);
  });

  humidityRef.on('value', (snapshot) => {
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
