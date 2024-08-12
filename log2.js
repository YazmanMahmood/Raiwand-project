import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, onValue, push } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';

// Your Firebase configuration
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
const database = getDatabase(app);

// Test database connection
const testRef = ref(database, '/');
onValue(testRef, (snapshot) => {
    console.log('Database connection successful. Root data:', snapshot.val());
}, (error) => {
    console.error('Error connecting to database:', error);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    const elements = {
        hamburger: document.querySelector('.hamburger'),
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        dataLogButton: document.getElementById('data-log-button')
    };

    function updateSetValuesTable() {
        console.log('Updating set values table');
        const tableBody = document.getElementById('log-table-body');

        if (!tableBody) {
            console.error("Table body element not found");
            return;
        }

        const logsRef = ref(database, 'bay 1/node 1/set_values_log');

        onValue(logsRef, (snapshot) => {
            console.log('Received set values data:', snapshot.val());
            const logs = [];
            snapshot.forEach((childSnapshot) => {
                const log = childSnapshot.val();
                if (log && log.timestamp) {
                    log.timestamp = new Date(log.timestamp);
                    logs.push(log);
                }
            });

            logs.sort((a, b) => b.timestamp - a.timestamp);
            tableBody.innerHTML = '';
            const limitedLogs = logs.slice(0, 100);

            limitedLogs.forEach((log) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.timestamp.toLocaleString()}</td>
                    <td>${log.temperature !== undefined ? log.temperature : 'N/A'}</td>
                    <td>${log.soil_moisture !== undefined ? log.soil_moisture : 'N/A'}</td>
                    <td>${log.humidity !== undefined ? log.humidity : 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });
            console.log('Table updated with', limitedLogs.length, 'entries');
        }, (error) => {
            console.error('Error fetching set values logs:', error);
        });
    }

    // Listen for value changes and update the set values log
    function listenForSetValueChanges() {
        const humidityRef = ref(database, 'bay 1/node 1/set values/humidity');
        const soilMoistureRef = ref(database, 'bay 1/node 1/set values/soil_moisture');
        const temperatureRef = ref(database, 'bay 1/node 1/set values/temperature');

        function logValueChange(snapshot, type) {
            const value = snapshot.val();
            const logEntry = {
                timestamp: Date.now(),
                temperature: type === 'temperature' ? value : null,
                soil_moisture: type === 'soil_moisture' ? value : null,
                humidity: type === 'humidity' ? value : null
            };

            const logRef = ref(database, 'bay 1/node 1/set_values_log');
            push(logRef, logEntry);
        }

        onValue(humidityRef, (snapshot) => {
            logValueChange(snapshot, 'humidity');
        }, (error) => {
            console.error('Error listening for humidity value changes:', error);
        });

        onValue(soilMoistureRef, (snapshot) => {
            logValueChange(snapshot, 'soil_moisture');
        }, (error) => {
            console.error('Error listening for soil moisture value changes:', error);
        });

        onValue(temperatureRef, (snapshot) => {
            logValueChange(snapshot, 'temperature');
        }, (error) => {
            console.error('Error listening for temperature value changes:', error);
        });
    }

    // Add event listener to the button
    elements.dataLogButton.addEventListener('click', () => {
        window.location.href = 'log.html';
    });

    // Initialize the table and start listening for set value changes
    updateSetValuesTable();
    listenForSetValueChanges();
});
