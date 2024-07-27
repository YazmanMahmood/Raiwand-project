import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        hamburger: document.querySelector('.hamburger'),
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        container: document.querySelector('.container')
    };

    // Firebase references
    const nodeRefs = {};
    for (let i = 1; i <= 6; i++) {
        nodeRefs[`node${i}`] = {
            temperature: ref(database, `bay 1/node ${i}/temperature`),
            humidity: ref(database, `bay 1/node ${i}/humidity`),
            soilMoisture: ref(database, `bay 1/node ${i}/soil_moisture`),
            lastReading: ref(database, `bay 1/node ${i}/last_reading`)
        };
    }

    // Toggle sidebar and hamburger button
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

    // Fan control functionality
    const fanButtons = {
        fan1: {
            auto: document.getElementById('fan1-auto'),
            on: document.getElementById('fan1-on'),
            off: document.getElementById('fan1-off')
        },
        fan2: {
            auto: document.getElementById('fan2-auto'),
            on: document.getElementById('fan2-on'),
            off: document.getElementById('fan2-off')
        },
        fan3: {
            auto: document.getElementById('fan3-auto'),
            on: document.getElementById('fan3-on'),
            off: document.getElementById('fan3-off')
        }
    };

    const fanStates = {
        fan1: { auto: false, state: 'OFF' },
        fan2: { auto: false, state: 'OFF' },
        fan3: { auto: false, state: 'OFF' }
    };

    function updateFanButton(fanId, mode, state) {
        if (mode === 'auto') {
            fanButtons[fanId].auto.textContent = `Auto: ${state ? 'ON' : 'OFF'}`;
            fanButtons[fanId].auto.classList.toggle('active', state);
        } else {
            fanButtons[fanId].on.classList.toggle('active', state === 'ON');
            fanButtons[fanId].off.classList.toggle('active', state === 'OFF');
        }
    }

    function setFanState(fanId, mode, state) {
        const fanRef = ref(database, `bay 1/controls/${fanId}`);
        set(fanRef, mode === 'auto' ? (state ? 'AUTO' : 'OFF') : state);
    }

    Object.keys(fanButtons).forEach(fanId => {
        fanButtons[fanId].auto.addEventListener('click', () => {
            const newState = !fanStates[fanId].auto;
            fanStates[fanId].auto = newState;
            updateFanButton(fanId, 'auto', newState);
            setFanState(fanId, 'auto', newState);
        });

        fanButtons[fanId].on.addEventListener('click', () => {
            fanStates[fanId].state = 'ON';
            fanStates[fanId].auto = false;
            updateFanButton(fanId, 'manual', 'ON');
            updateFanButton(fanId, 'auto', false);
            setFanState(fanId, 'manual', 'ON');
        });

        fanButtons[fanId].off.addEventListener('click', () => {
            fanStates[fanId].state = 'OFF';
            fanStates[fanId].auto = false;
            updateFanButton(fanId, 'manual', 'OFF');
            updateFanButton(fanId, 'auto', false);
            setFanState(fanId, 'manual', 'OFF');
        });

        // Set up Firebase listeners for fan states
        const fanRef = ref(database, `bay 1/controls/${fanId}`);
        onValue(fanRef, (snapshot) => {
            const value = snapshot.val();
            if (value === 'AUTO') {
                fanStates[fanId].auto = true;
                updateFanButton(fanId, 'auto', true);
            } else {
                fanStates[fanId].auto = false;
                fanStates[fanId].state = value;
                updateFanButton(fanId, 'auto', false);
                updateFanButton(fanId, 'manual', value);
            }
        });
    });

    // Function to control fans automatically based on temperature
    function controlFansAutomatically(temperature) {
        Object.keys(fanStates).forEach(fanId => {
            if (fanStates[fanId].auto) {
                let newState;
                if (temperature > 28) {
                    newState = 'ON';
                } else if (temperature > 25 && fanId !== 'fan3') {
                    newState = 'ON';
                } else if (temperature > 22 && fanId === 'fan1') {
                    newState = 'ON';
                } else {
                    newState = 'OFF';
                }
                if (newState !== fanStates[fanId].state) {
                    fanStates[fanId].state = newState;
                    updateFanButton(fanId, 'manual', newState);
                    setFanState(fanId, 'manual', newState);
                }
            }
        });
    }

    function handleNodeInteraction(nodeId) {
        const node = document.querySelector(`.node.${nodeId}`);
        const popup = document.getElementById(`popup-${nodeId}`);
    
        function handleClick(event) {
            event.preventDefault();
            const nodeNumber = nodeId.replace('node', '');
            window.location.href = `node${nodeNumber}.html`;
        }
    
        function handleMouseEnter() {
            if (window.innerWidth > 768) {
                updateNodeData(nodeId, popup);
                showPopup(node, popup);
            }
        }
    
        function handleMouseLeave() {
            if (window.innerWidth > 768) {
                hidePopup(popup);
            }
        }
    
        // Add event listeners
        node.addEventListener('click', handleClick);
        node.addEventListener('mouseenter', handleMouseEnter);
        node.addEventListener('mouseleave', handleMouseLeave);
    
        // Store the event listeners for potential removal
        node.nodeInteractionListeners = {
            click: handleClick,
            mouseenter: handleMouseEnter,
            mouseleave: handleMouseLeave
        };
    }

    // Function to update node data
    function updateNodeData(nodeId, popup) {
        const popupContent = popup.querySelector('.popup-content');
        
        onValue(nodeRefs[nodeId].temperature, (snapshot) => {
            const temperature = snapshot.val();
            popupContent.innerHTML = `<p><strong>Temperature:</strong> ${temperature}°C</p>`;
        });

        onValue(nodeRefs[nodeId].humidity, (snapshot) => {
            const humidity = snapshot.val();
            popupContent.innerHTML += `<p><strong>Humidity:</strong> ${humidity}%</p>`;
        });

        onValue(nodeRefs[nodeId].soilMoisture, (snapshot) => {
            const soilMoisture = snapshot.val();
            popupContent.innerHTML += `<p><strong>Soil Moisture:</strong> ${soilMoisture}%</p>`;
        });

        onValue(nodeRefs[nodeId].lastReading, (snapshot) => {
            const lastReading = snapshot.val();
            popupContent.innerHTML += `<p><strong>Last Reading:</strong> ${lastReading}</p>`;
        });
    }

    // Function to show popup
    function showPopup(node, popup) {
        popup.style.display = 'block';

        const rect = node.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        let top, left;

        if (window.innerWidth <= 768) {
            top = rect.bottom + window.scrollY + 10;
            left = Math.max(10, Math.min(window.innerWidth - popupRect.width - 10, rect.left));
        } else {
            top = rect.top + window.scrollY + rect.height / 2 - popupRect.height / 2;
            left = ['node1', 'node3', 'node5'].includes(node.classList[1]) ?
                rect.left - popupRect.width - 15 :
                rect.right + 15;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
    }

    // Function to hide popup
    function hidePopup(popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    function initializeNodeOpacity() {
        document.querySelectorAll('.node').forEach((node) => {
            node.style.opacity = '0.5';
        });
    }

    // Function to initialize node interactions
    function initializeNodeInteractions() {
        document.querySelectorAll('.node').forEach((node) => {
            const nodeId = node.classList[1];
            handleNodeInteraction(nodeId);
            // Set node opacity to 0.5
            node.style.opacity = '0.5';
        });
    }

    // Add event listener for window resize to reposition popups
    window.addEventListener('resize', () => {
        document.querySelectorAll('.node').forEach((node) => {
            const nodeId = node.classList[1];
            handleNodeInteraction(nodeId);
        });
    });

    // Update average measurements periodically
    function updateAverageMeasurements() {
        let totalTemperature = 0;
        let totalHumidity = 0;
        let totalSoilMoisture = 0;
        let count = 0;

        Object.values(nodeRefs).forEach(node => {
            onValue(node.temperature, (snapshot) => {
                totalTemperature += snapshot.val();
                count++;
                if (count === 6) {
                    const avgTemperature = (totalTemperature / 6).toFixed(1);
                    document.getElementById('avg-temperature').textContent = avgTemperature;
                    controlFansAutomatically(parseFloat(avgTemperature));
                }
            });

            onValue(node.humidity, (snapshot) => {
                totalHumidity += snapshot.val();
                document.getElementById('avg-humidity').textContent = (totalHumidity / 6).toFixed(1);
            });

            onValue(node.soilMoisture, (snapshot) => {
                totalSoilMoisture += snapshot.val();
                document.getElementById('avg-soil-moisture').textContent = (totalSoilMoisture / 6).toFixed(1);
            });
        });
    }

    // Function to update fan status
    function updateFanStatus() {
        const fanStatusElement = document.getElementById('fan-status');
        const fanPaths = ['fan1', 'fan2', 'fan3'];
        let statusTexts = [];

        fanPaths.forEach((fanPath, index) => {
            const fanRef = ref(database, `bay 1/controls/${fanPath}`);
            onValue(fanRef, (snapshot) => {
                const status = snapshot.val();
                let statusText = '';
                
                if (status === 'AUTO') {
                    statusText = 'Auto';
                } else if (status === 'ON') {
                    statusText = 'On';
                } else if (status === 'OFF') {
                    statusText = 'Off';
                }
                
                statusTexts[index] = `Fan ${index + 1}: ${statusText}`;
                fanStatusElement.innerHTML = statusTexts.join('<br>');
            });
        });
    }

    // Update measurements and fan status every 10 seconds
    updateAverageMeasurements();
    updateFanStatus();
    setInterval(() => {
        updateAverageMeasurements();
        updateFanStatus();
    }, 10000);

    // Dropdown functionality for sidebar
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

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-btn')) {
            const dropdowns = document.querySelectorAll('.dropdown-container');
            dropdowns.forEach((dropdown) => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });

            const dropdownBtns = document.querySelectorAll('.dropdown-btn');
            dropdownBtns.forEach((btn) => {
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                }
            });
        }
    });

    // Event listener for dropdown button
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
            } else {
                dropdownContent.style.display = 'block';
            }
        });
    });

    // Initialize node interactions
    initializeNodeInteractions();
});
