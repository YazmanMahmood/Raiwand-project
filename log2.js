import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, onValue, push, get } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';

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
    
        const logsRef = ref(database, 'bay 1/set_value_log');
    
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
            const limitedLogs = logs.slice(0, 100);
    
            // Clear existing rows
            tableBody.innerHTML = '';
    
            // Add new rows at the top
            limitedLogs.forEach((log) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.timestamp.toLocaleString()}</td>
                    <td>${log.temperature !== undefined ? log.temperature : 'N/A'}</td>
                    <td>${log.soil_moisture !== undefined ? log.soil_moisture : 'N/A'}</td>
                    <td>${log.humidity !== undefined ? log.humidity : 'N/A'}</td>
                `;
                tableBody.insertBefore(row, tableBody.firstChild);
            });
            console.log('Table updated with', limitedLogs.length, 'entries');
        }, (error) => {
            console.error('Error fetching set values logs:', error);
        });
    }
    // Listen for value changes and update the set values log
    function listenForSetValueChanges() {
        const setValuesRef = ref(database, 'bay 1/set values');

        onValue(setValuesRef, async (snapshot) => {
            const setValues = snapshot.val();
            if (!setValues) return;

            const timeRef = ref(database, 'Time_stamp/Time');
            const timeSnapshot = await get(timeRef);
            const timestamp = timeSnapshot.val() || Date.now();

            const logEntry = {
                timestamp: timestamp,
                temperature: setValues.temperature || null,
                soil_moisture: setValues.soil_moisture || null,
                humidity: setValues.humidity || null
            };

            const logRef = ref(database, 'bay 1/set_value_log');
            push(logRef, logEntry);
        }, (error) => {
            console.error('Error listening for set value changes:', error);
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
