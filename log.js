import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, get, set, onValue } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Database object:', database); // Debug log

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        setValuesButton: document.querySelector('.history-button'),
        dropdownBtns: document.querySelectorAll('.dropdown-btn'),
        tableBody: document.getElementById('log-table-body'),
        sidePanelSections: document.querySelectorAll('.side-panel .section'),
        errorBox: document.getElementById('error-box'),
        errorMessage: document.getElementById('error-message'),
        hamburger: document.getElementById('hamburger-btn'),
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

    // Sidebar functionality
    elements.hamburger.addEventListener('click', toggleSidebar);
    document.addEventListener('click', closeSidebarOnOutsideClick);
    elements.sidebar.addEventListener('click', (e) => e.stopPropagation());

    // Redirect to log2.html on button click
    elements.setValuesButton?.addEventListener('click', () => {
        window.location.href = 'log2.html';
    });

    // Dropdown functionality
    elements.dropdownBtns.forEach(btn => btn.addEventListener('click', toggleDropdown));
    document.addEventListener('click', closeDropdowns);

    // Responsive design
    const debouncedResize = debounce(() => {
        adjustForMobile();
        adjustSidePanelHeights();
        adjustTextSizes();
    }, 250);
    window.addEventListener('resize', debouncedResize);

    // Initialize controls
    adjustSidePanelHeights();
    adjustForMobile();
    adjustTextSizes();
});

function toggleSidebar(e) {
    e.stopPropagation();
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const hamburger = document.getElementById('hamburger-btn');
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('shifted');
}

function closeSidebarOnOutsideClick(event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.getElementById('hamburger-btn');
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(event.target) &&
        !hamburger.contains(event.target)) {
        hamburger.classList.remove('active');
        sidebar.classList.remove('open');
        document.querySelector('.main-content').classList.remove('shifted');
    }
}

function toggleDropdown(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    const dropdownContainer = this.nextElementSibling;
    dropdownContainer.style.maxHeight = dropdownContainer.style.maxHeight ? null : `${dropdownContainer.scrollHeight}px`;
}

function closeDropdowns(event) {
    if (!event.target.matches('.dropdown-btn')) {
        document.querySelectorAll('.dropdown-container').forEach(dropdown => {
            dropdown.style.maxHeight = null;
            dropdown.previousElementSibling.classList.remove('active');
        });
    }
}

function adjustForMobile() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
    sidebar.style.width = isMobile ? '0' : '200px';
    mainContent.style.marginLeft = isMobile ? '0' : '240px';
}

function adjustSidePanelHeights() {
    const sidePanelSections = document.querySelectorAll('.side-panel .section');
    sidePanelSections.forEach(section => {
        const title = section.querySelector('h2');
        const content = section.querySelector('.status-item, .measurement-item, .fan-control, .water-control, .set-value-widget');
        if (title && content) {
            section.style.minHeight = `${title.offsetHeight + content.offsetHeight + 40}px`;
        }
    });
}

function adjustTextSizes() {
    const sidePanelSections = document.querySelectorAll('.side-panel .section');
    sidePanelSections.forEach(container => {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const fontSize = Math.min(containerWidth * 0.05, containerHeight * 0.1);
        container.style.fontSize = `${fontSize}px`;
    });
}

function updateDataTable() {
    if (!navigator.onLine) {
        const data = {
            timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
            temperature: 0,
            soil_moisture: 0,
            humidity: 0,
            battery: 0,
            dht_check: 0,
            power_1_status: 0,
            rssi: 0,
            active: 0
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
            '/Time_stamp/Time'
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
                ] = snapshots.map(snapshot => snapshot.val() ?? 0);

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

                const safeTimestamp = timestamp.replace(/[:.]/g, '-');

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
            const safeTimestamp = data.timestamp.replace(/[:.]/g, '-');
            const logsRef = ref(database, `bay 1/logs/node1/${safeTimestamp}`);
            set(logsRef, data)
                .then(() => {
                    console.log('Data synchronized successfully');
                })
                .catch(error => {
                    console.error('Error synchronizing data:', error);
                });
        });
        localStorage.removeItem('offlineData');
    }
}

function fetchHistoricalData() {
    const logsRef = ref(database, '/bay 1/logs/node1');
    onValue(logsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const tableBody = document.getElementById('log-table-body');
            tableBody.innerHTML = '';

            const sortedEntries = Object.entries(data).sort((a, b) => {
                return new Date(b[0]) - new Date(a[0]);
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
