const firebaseConfig = {
  apiKey: "AIzaSyAlcdyemR4pi-ImLUurDmSvZNToqoosvfY",
  "type": "service_account",
  "project_id": "test-a85e5",
  "private_key_id": "cd9d6c02b1de5d46ca6cb9103c8a424df43ff711",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCvI2VQ3WkmXso\n6L5Ctdl6KD5OWekZVvy1VuCFSWArT/qh10PPaUfmb4S92uIk+a8YB6z3Jd4vTbz6\nCZ4rqa8oS/BOYt3cBbYLSXdlDZTbNAQZkft4HH7vDYLa2pw0AC8hm6lyPlRwJloM\nSj8wttltcgtnTvQUEYP+N4dCVCddMbhn5+JeIROZwIiMMl7JIwFoKIy/tv5jM0KC\nLtxluOE/Kl88o2OLMSThGTke05GDRAd0x/DUQxx0+jb7susXksWQFoTiilloPHgd\nAR34WTCvNICA3rWO8N+kssz8IX3xliGjjvcPcEi4ElZot1eWhRfS5QeHdCzo7tu9\npTZSUA71AgMBAAECggEAFrhVg332ppDioev/sLxTRpGV7WHHlLWFr+mWMe7U6dC/\nwuyg5HzZzuyhbd4xBtPbxh+1IjO4l8fH3dtL6Te3sCml/JtD28UNz4TPiYp7XNTV\nip8x2fpnI+BtbTfWxClmVlM5QpM7mkcbN/Zcp4QZ249T/cZkK0g84GbdoNM9MX3k\ns9epMWiFPHA11/xHNRKWoYoro2uZGyWdN6lFEGq1AgtIf8OOddmsM6j3VYPpfCvv\n+joHWPkEliqLb9Kk37RvlRySPauoGFhQS44MxIuBkE+yHNXtopea2KXUzjSNDadE\nQ5wCZg0c18JA8x8Z4yN/0x+y5XIk6eg9G8ZtFEZxcQKBgQDjw4CYxK67HoQoUx9L\nMnOoDCWd+w1vtNhtSoiNOMbL9Cmf6XmAx591arAG+pUsYAwA+xbjfLLpkB2AtNP4\nUUPAKSdC6f8FDunQESm6y721kjnuoRkJhRhGvk49ctGtUq8aGWAwFI7S1y9tge2c\ncikKVb/ZKdQKId7pHdT2uWSlRQKBgQDa4N+um46hvO9HFLgR9iC7ccwRqQIHUdlr\nLxQ+Qv3ngAJtpc7rlK8BEYMNJXL8B/5TOUzTa7kX3FhpF5GTp0DoaArtBdkJgNdc\nJF749Ez/wrLKTevoXpxPM3V6byBhlZNoCN0X0QnB+95OvrGGPCBKkeCSEvZ2KLHR\nIGkomQ+l8QKBgEzn6Zcr6lgSgMtg7dMlUPowR89lQu8yIFYe8abFwhKB+kAdxMIg\nJY6vHIrut8oJEGSQY/UiWQMWf2/DH0PcpMTQ4InumwapN3fjI7UIMKGLo3YY/WxC\nfaT9g0uqZnRg0/E7GkiB2IwGzuPqGEJYJdVwiNwaDJfzQeJzCULZ7MsFAoGBAJTw\nuMVkbSZ6HojL/IWcaqGiyi6qRwscE0rwemHzzDsfzIc4cRm1z3B2rirf9OKzvch8\nEV88ynMGKdM5ioJjKbP8OJMZi5r/5Yx543adJ1hS8L7hT0qMNuleJu7td6dv1SLS\nBUETqgQqlBgZg0vI1mBn69z6smOtRXL9DxHlNdTBAoGAUT5pLbNEcwrcy2Td4mT3\nUl/cv7wi1MKoux4P2zwxRICuth3imUXE+LCm6RxA4UCC2jNbgG9lX4zdu+gMTZDd\nc6KF8769tbeZvLVCx6QQ7Uo1Q6qFMtlEBavyRfPQkVQzkJ1lY3aADSI3u8uV2BqI\nhmfRkUn4caSeTcojVU5a9nA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-icsnu@test-a85e5.iam.gserviceaccount.com",
  "client_id": "108807891615257943103",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-icsnu%40test-a85e5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
