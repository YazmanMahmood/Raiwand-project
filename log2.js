import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';

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

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        hamburger: document.querySelector('.hamburger'),
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        dataLogButton: document.getElementById('data-log-button')
    };

    function updateSetValuesTable() {
        const tableBody = document.getElementById('log-table-body');

        if (!tableBody) {
            console.error("Table body element not found");
            return;
        }

        const logsRef = ref(database, 'bay 1/node 1/set-values-log');

        onValue(logsRef, (snapshot) => {
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
        }, (error) => {
            console.error('Error fetching set values logs:', error);
        });
    }

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

    // Handle data log button click
    if (elements.dataLogButton) {
        elements.dataLogButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'log.html';
        });
    } else {
        console.error('Data log button not found');
    }

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

    // Initialize the table
    updateSetValuesTable();
});