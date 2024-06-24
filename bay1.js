<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAmVSOm8g6p4F3ZY4jxIEUTQH_oFllo1hg",
    authDomain: "greenhouse-raiwind.firebaseapp.com",
    databaseURL: "https://greenhouse-raiwind-default-rtdb.firebaseio.com",
    projectId: "greenhouse-raiwind",
    storageBucket: "greenhouse-raiwind.appspot.com",
    messagingSenderId: "338760023791",
    appId: "1:338760023791:web:667a022e8b69459eb2651a",
    measurementId: "G-CPD0XFLYN5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Get the current date and time
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Set the last reading date and time
    document.getElementById('last-reading').innerText = formattedDate;

    // Chart.js setup
    const summaryCtx = document.getElementById('summary-chart').getContext('2d');
    const summaryChart = new Chart(summaryCtx, {
        type: 'line',
        data: {
            labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
            datasets: [{
                label: 'Temperature',
                data: [30, 32, 31, 29, 28, 27, 25],
                backgroundColor: 'rgba(26, 188, 156, 0.2)',
                borderColor: 'rgba(26, 188, 156, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true,
                    min: 0,  // Set minimum value for y-axis
                    max: 50  // Set maximum value for y-axis
                }
            }
        }
    });

    // Create gauges
    const soilMoistureGauge = new JustGage({
        id: "soil-moisture-gauge",
        value: 87.5,
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
        value: 32.5,
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
        value: 85,
        min: 0,
        max: 100,
        title: "Humidity",
        label: "%",
        pointer: true,
        gaugeWidthScale: 0.6,
        levelColors: ["#00ff00", "#ff0000"]
    });

    // Function to update gauges and last reading from Firebase
    function updateData(snapshot) {
        const data = snapshot.val();
        soilMoistureGauge.refresh(data.soilMoisture);
        temperatureGauge.refresh(data.temperature);
        humidityGauge.refresh(data.humidity);

        const lastReadingTime = new Date(data.lastReading);
        document.getElementById('last-reading').innerText = lastReadingTime.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Listen for changes in Firebase
    database.ref('bay1').on('value', updateData);
});

function toggleWater() {
    const button = document.getElementById('water-button');
    const isWaterOn = button.innerText === 'Turn Water On';
    button.innerText = isWaterOn ? 'Turn Water Off' : 'Turn Water On';
    console.log(`Water is now ${isWaterOn ? 'ON' : 'OFF'}`);

    // Update water state in Firebase
    firebase.database().ref('bay1/water').set(isWaterOn);
}
