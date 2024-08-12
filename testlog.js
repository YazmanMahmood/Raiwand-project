import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, get, set, onValue } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Database object:', database); // Debug log

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    hamburger: document.querySelector('#sidebarToggle'),
    sidebar: document.querySelector('.sidebar'),
    mainContent: document.querySelector('.main-content'),
    setValuesButton: document.querySelector('.history-button'),
    dropdownBtns: document.querySelectorAll('.dropdown-btn'),
    tableBody: document.getElementById('log-table-body')
  };

  // Check connection to database
  get(ref(database, '/')).then(() => {
    console.log("Successfully connected to the database");

    // Load historical logs
    fetchHistoricalData();

    // Initialize the table and start periodic updates
    setInterval(updateDataTable, 10000); // Update every 10 seconds

    // Synchronize local data when the system is back online
    window.addEventListener('online', synchronizeData);
    synchronizeData(); // Check for offline data on load
  }).catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

  // Toggle sidebar on hamburger click
  elements.hamburger?.addEventListener('click', toggleSidebar);

  // Close sidebar when clicking outside
  document.addEventListener('click', handleOutsideClick);

  // Prevent sidebar from closing when clicking inside it
  elements.sidebar?.addEventListener('click', (e) => e.stopPropagation());

  // Redirect to log2.html on button click
  elements.setValuesButton?.addEventListener('click', () => {
    window.location.href = 'log2.html';
  });

  // Dropdown functionality for sidebar
  elements.dropdownBtns.forEach(dropdownBtn => {
    dropdownBtn.addEventListener('click', toggleDropdown);
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", closeDropdowns);

  // Mobile responsiveness
  window.addEventListener('resize', adjustForMobile);
  adjustForMobile(); // Call once on load
});

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const hamburger = document.querySelector('#sidebarToggle');
  
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('shifted');
  hamburger.classList.toggle('active');
}

function handleOutsideClick(event) {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.querySelector('#sidebarToggle');
  
  if (sidebar && sidebar.classList.contains('open') &&
      !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
    sidebar.classList.remove('open');
    document.querySelector('.main-content')?.classList.remove('shifted');
    hamburger.classList.remove('active');
  }
}

function toggleDropdown(e) {
  e.stopPropagation();
  const dropdownContainer = this.nextElementSibling;
  this.classList.toggle('active');
  dropdownContainer.style.maxHeight = dropdownContainer.style.maxHeight ? null : `${dropdownContainer.scrollHeight}px`;
}

function closeDropdowns(event) {
  if (!event.target.matches('.dropdown-btn')) {
    document.querySelectorAll('.dropdown-container').forEach(dropdown => {
      if (dropdown.style.maxHeight) {
        dropdown.style.maxHeight = null;
        dropdown.previousElementSibling.classList.remove('active');
      }
    });
  }
}

function updateDataTable() {
    if (!navigator.onLine) {
        const data = {
            timestamp: new Date().toISOString().replace(/[:.]/g, '-'), // Replace both colons and periods
            temperature: 0, // Replace with actual data or set to 0 if system is off
            soil_moisture: 0, // Replace with actual data or set to 0 if system is off
            humidity: 0, // Replace with actual data or set to 0 if system is off
            battery: 0, // Replace with actual data or set to 0 if system is off
            dht_check: 0, // Replace with actual data or set to 0 if system is off
            power_1_status: 0, // Replace with actual data or set to 0 if system is off
            rssi: 0, // Replace with actual data or set to 0 if system is off
            active: 0 // Replace with actual data or set to 0 if system is off
        };
        saveToLocalStorage(data);
    } else {
        const paths = [
            '/bay 1/node 1/soil_moisture',
            '/bay 1/node 1/humidity',
            '/bay 1/node 1/temperature',
            '/bay 1/node 1/Battery',
            '/bay 1/node 1/DHT_check',
            '/bay 1/node 1/Power_1_status',
            '/bay 1/node 1/RSSI',
            '/bay 1/node 1/active',
            '/Time_stamp/Time' // Path to fetch the timestamp
        ];

        Promise.all(paths.map(path => get(ref(database, path))))
            .then(snapshots => {
                const [
                    soil_moisture,
                    humidity,
                    temperature,
                    battery,
                    dht_check,
                    power_1_status,
                    rssi,
                    active,
                    timestamp
                ] = snapshots.map(snapshot => snapshot.val() ?? 0); // Default to 0 if data is missing

                const tableBody = document.getElementById('log-table-body');

                const newRow = `
                    <tr>
                        <td>${timestamp}</td>
                        <td>${temperature?.toFixed(1) ?? 'N/A'}</td>
                        <td>${soil_moisture?.toFixed(1) ?? 'N/A'}</td>
                        <td>${humidity?.toFixed(1) ?? 'N/A'}</td>
                        <td>${battery ?? 'N/A'}</td>
                        <td>${dht_check ?? 'N/A'}</td>
                        <td>${power_1_status ?? 'N/A'}</td>
                        <td>${rssi ?? 'N/A'}</td>
                        <td>${active ?? 'N/A'}</td>
                    </tr>
                `;

                tableBody.insertAdjacentHTML('afterbegin', newRow);

                while (tableBody.children.length > 100) {
                    tableBody.lastElementChild.remove();
                }

                const safeTimestamp = timestamp.replace(/[:.]/g, '-'); // Replace both colons and periods

                const logData = {
                    Timestamp: timestamp,
                    Humidity: humidity ?? 0,
                    Soil_moisture: soil_moisture ?? 0,
                    Temperature: temperature ?? 0,
                    Battery: battery ?? 0,
                    DHT_check: dht_check ?? 0,
                    Power_1_status: power_1_status ?? 0,
                    RSSI: rssi ?? 0,
                    Active: active ?? 0
                };

                const logsRef = ref(database, `bay 1/logs/node1/${safeTimestamp}`);
                return set(logsRef, logData);
            })
            .then(() => {
                console.log('Data logged successfully');
            })
            .catch(error => {
                console.error('Error fetching or logging data:', error);
            });
    }
}


function synchronizeData() {
    if (navigator.onLine) {
        let offlineData = JSON.parse(localStorage.getItem('offlineData')) || [];
        offlineData.forEach(data => {
            const safeTimestamp = data.timestamp.replace(/[:.]/g, '-'); // Replace both colons and periods
            const logsRef = ref(database, `bay 1/logs/node1/${safeTimestamp}`);
            set(logsRef, data)
                .then(() => {
                    console.log('Data synchronized successfully');
                })
                .catch(error => {
                    console.error('Error synchronizing data:', error);
                });
        });
        localStorage.removeItem('offlineData'); // Clear local storage after sync
    }
}


function fetchHistoricalData() {
    const logsRef = ref(database, '/bay 1/logs/node1');
    onValue(logsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const tableBody = document.getElementById('log-table-body');
            tableBody.innerHTML = ''; // Clear existing table rows

            const sortedEntries = Object.entries(data).sort((a, b) => {
                return new Date(b[0]) - new Date(a[0]); // Newest first
            });

            sortedEntries.forEach(([timestamp, logData]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${timestamp}</td>
                    <td>${logData.Temperature?.toFixed(1) ?? 'N/A'}</td>
                    <td>${logData.Soil_moisture?.toFixed(1) ?? 'N/A'}</td>
                    <td>${logData.Humidity?.toFixed(1) ?? 'N/A'}</td>
                    <td>${logData.Battery ?? 'N/A'}</td>
                    <td>${logData.DHT_check ?? 'N/A'}</td>
                    <td>${logData.Power_1_status ?? 'N/A'}</td>
                    <td>${logData.RSSI ?? 'N/A'}</td>
                    <td>${logData.Active ?? 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    });
}

function saveToLocalStorage(data) {
    let offlineData = JSON.parse(localStorage.getItem('offlineData')) || [];
    offlineData.push(data);
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
}

function adjustForMobile() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth <= 768) {
        sidebar.classList.add('mobile');
        mainContent.classList.add('mobile');
    } else {
        sidebar.classList.remove('mobile');
        mainContent.classList.remove('mobile');
    }
}
