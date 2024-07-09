document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');

  // Toggle sidebar on hamburger menu click
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when a link inside it is clicked (for mobile view)
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  });

  // Initialize Firebase references
  const lastReadingRef = firebase.database().ref('Esp1/ESP_20240622030452');
  const temperatureRef = firebase.database().ref('Esp1/temperature');
  const soilMoistureRef = firebase.database().ref('Esp1/soil_moisture');
  const humidityRef = firebase.database().ref('Esp1/humidity');

  // Get the initial last reading date and time
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

  // Listen for changes in the temperature data
  temperatureRef.on('value', (snapshot) => {
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

  // Listen for changes in the soil moisture data
  soilMoistureRef.on('value', (snapshot) => {
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

  // Listen for changes in the humidity data
  humidityRef.on('value', (snapshot) => {
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

});
