import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
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

        // Synchronize local data when the system is back online
        window.addEventListener('online', synchronizeData);
        synchronizeData(); // Check for offline data on load
    }).catch((error) => {
        console.error("Failed to connect to the database:", error);
        showError("Failed to connect to the database. Please check your internet connection and try again.");
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
                    showError("Failed to synchronize offline data. Please try again later.");
                });
        });
        localStorage.removeItem('offlineData');
    }
}

function fetchHistoricalData() {
    const logsRef = ref(database, '/bay 1/logs/node1');
    onValue(logsRef, (snapshot) => {
        try {
            const data = snapshot.val();
            if (data) {
                const tableBody = document.getElementById('log-table-body');
                tableBody.innerHTML = '';

                const sortedEntries = Object.entries(data).sort((a, b) => {
                    return new Date(b[0]) - new Date(a[0]);
                }).reverse(); // Reverse the sorted entries

                sortedEntries.forEach(([timestamp, logData]) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${timestamp}</td>
                        <td>${formatValue(logData.Temperature)}</td>
                        <td>${formatValue(logData.Soil_moisture)}</td>
                        <td>${formatValue(logData.Humidity)}</td>
                        <td>${formatValue(logData.Battery)}</td>
                        <td>${formatValue(logData.DHT_check)}</td>
                        <td>${formatValue(logData.Power_1_status)}</td>
                        <td>${formatValue(logData.RSSI)}</td>
                        <td>${formatValue(logData.Active)}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error processing historical data:', error);
            showError("Failed to process historical data. Please refresh the page and try again.");
        }
    }, (error) => {
        console.error('Error fetching historical data:', error);
        showError("Failed to fetch historical data. Please check your internet connection and try again.");
    });
}

function formatValue(value) {
    if (typeof value === 'number') {
        return value.toFixed(1);
    } else if (value === undefined || value === null) {
        return 'N/A';
    } else {
        return value.toString();
    }
}

function showError(message) {
    const errorBox = document.getElementById('error-box');
    const errorMessage = document.getElementById('error-message');
    if (errorBox && errorMessage) {
        errorMessage.textContent = message;
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    } else {
        console.error('Error displaying message:', message);
    }
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
