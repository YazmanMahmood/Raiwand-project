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
        dataLogButton: document.getElementById('data-log-button'),
        dropdownBtns: document.querySelectorAll('.dropdown-btn'),
        sidePanelSections: document.querySelectorAll('.side-panel .section')
    };

    // Sidebar functionality
    elements.hamburger.addEventListener('click', toggleSidebar);
    document.addEventListener('click', closeSidebarOnOutsideClick);
    elements.sidebar.addEventListener('click', (e) => e.stopPropagation());

    // Add event listener to the button
    elements.dataLogButton.addEventListener('click', () => {
        window.location.href = 'log.html';
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

    // Initialize the table and start listening for set value changes
    updateSetValuesTable();
    listenForSetValueChanges();
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
            tableBody.insertBefore(row, tableBody.firstChild); // Insert at the top
        });
        console.log('Table updated with', limitedLogs.length, 'entries');
    }, (error) => {
        console.error('Error fetching set values logs:', error);
    });
}

// Listen for value changes and update the set values log
function listenForSetValueChanges() {
    const setValuesRef = ref(database, 'set values'); // Updated path

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
        push(logRef, logEntry).then(() => {
            // Prepend new log entry to the table
            const tableBody = document.getElementById('log-table-body');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(logEntry.timestamp).toLocaleString()}</td>
                <td>${logEntry.temperature !== undefined ? logEntry.temperature : 'N/A'}</td>
                <td>${logEntry.soil_moisture !== undefined ? logEntry.soil_moisture : 'N/A'}</td>
                <td>${logEntry.humidity !== undefined ? logEntry.humidity : 'N/A'}</td>
            `;
            tableBody.insertBefore(row, tableBody.firstChild); // Insert at the top
        });
    }, (error) => {
        console.error('Error listening for set value changes:', error);
    });
}
