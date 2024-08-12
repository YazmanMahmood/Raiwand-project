import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        hamburger: document.querySelector('.hamburger'),
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        popup: document.getElementById('popup'),
        popupMessage: document.getElementById('popup-message'),
        popupClose: document.getElementById('popup-close'),
        nodes: document.querySelectorAll('.node'),
        fanStatusElement: document.getElementById('fan-status'),
        dropdownBtns: document.querySelectorAll('.dropdown-btn')
    };

    // Check if popup close button exists before adding event listener
    if (elements.popupClose) {
        elements.popupClose.addEventListener('click', hidePopup);
    }

    // Define showPopup and hidePopup functions
    function showPopup(message) {
        if (elements.popup && elements.popupMessage) {
            elements.popupMessage.textContent = message;
            elements.popup.style.display = 'block';
            setTimeout(() => {
                elements.popup.classList.add('show');
            }, 10);
        } else {
            console.warn('Popup elements not found');
        }
    }

    function hidePopup() {
        if (elements.popup) {
            elements.popup.classList.remove('show');
            setTimeout(() => {
                elements.popup.style.display = 'none';
            }, 300);
        }
    }

    // Dropdown functionality for sidebar
    if (elements.dropdownBtns.length > 0) {
        elements.dropdownBtns.forEach((dropdownBtn) => {
            dropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                const dropdownContainer = this.nextElementSibling;
                if (dropdownContainer) {
                    dropdownContainer.style.maxHeight = dropdownContainer.style.maxHeight ? null : dropdownContainer.scrollHeight + "px";
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener("click", function(event) {
            if (!event.target.matches('.dropdown-btn')) {
                const dropdowns = document.getElementsByClassName("dropdown-container");
                for (let i = 0; i < dropdowns.length; i++) {
                    const openDropdown = dropdowns[i];
                    openDropdown.style.maxHeight = null;
                    if (openDropdown.previousElementSibling) {
                        openDropdown.previousElementSibling.classList.remove('active');
                    }
                }
            }
        });
    } else {
        console.warn('No dropdown buttons found');
    }

    // Firebase node references
    const nodeRefs = {
        node1: {
            temperature: ref(database, 'bay 1/node 1/temperature'),
            humidity: ref(database, 'bay 1/node 1/humidity'),
            soilMoisture: ref(database, 'bay 1/node 1/soil_moisture'),
            lastReading: ref(database, 'bay 1/node 1/last_reading')
        },
        node2: {
            temperature: ref(database, 'bay 1/node 2/temperature'),
            humidity: ref(database, 'bay 1/node 2/humidity'),
            soilMoisture: ref(database, 'bay 1/node 2/soil_moisture'),
            lastReading: ref(database, 'bay 1/node 2/last_reading')
        },
        node3: {
            temperature: ref(database, 'bay 1/node 3/temperature'),
            humidity: ref(database, 'bay 1/node 3/humidity'),
            soilMoisture: ref(database, 'bay 1/node 3/soil_moisture'),
            lastReading: ref(database, 'bay 1/node 3/last_reading')
        },
        node4: {
            temperature: ref(database, 'bay 1/node 4/temperature'),
            humidity: ref(database, 'bay 1/node 4/humidity'),
            soilMoisture: ref(database, 'bay 1/node 4/soil_moisture'),
            lastReading: ref(database, 'bay 1/node 4/last_reading')
        },
        node5: {
            temperature: ref(database, 'bay 1/node 5/temperature'),
            humidity: ref(database, 'bay 1/node 5/humidity'),
            soilMoisture: ref(database, 'bay 1/node 5/soil_moisture'),
            lastReading: ref(database, 'bay 1/node 5/last_reading')
        },
        node6: {
            temperature: ref(database, 'bay 1/node 6/temperature'),
            humidity: ref(database, 'bay 1/node 6/humidity'),
            soilMoisture: ref(database, 'bay 1/node 6/soil_moisture'),
            lastReading: ref(database, 'bay 1/node 6/last_reading')
        }
    };

    // Toggle sidebar and hamburger button
    if (elements.hamburger && elements.sidebar && elements.mainContent) {
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
    }

    // Fan control functionality
    const fanControls = ['fan1', 'fan2', 'fan3'].map(fanId => ({
        auto: document.getElementById(`${fanId}-auto`),
        on: document.getElementById(`${fanId}-on`),
        off: document.getElementById(`${fanId}-off`),
        status: 'OFF'
    })).filter(control => control.auto && control.on && control.off);

    function updateFanButton(fanControl) {
        fanControl.auto.classList.toggle('active', fanControl.status === 'Auto');
        fanControl.on.classList.toggle('active', fanControl.status === 'On');
        fanControl.off.classList.toggle('active', fanControl.status === 'Off');
    }

    function setFanState(fanId, status) {
        const fanRef = ref(database, `bay 1/controls/${fanId}`);
        set(fanRef, status);
    }

    fanControls.forEach((fanControl, index) => {
        const fanId = `fan${index + 1}`;

        fanControl.auto.addEventListener('click', () => {
            setFanState(fanId, 'Auto');
        });

        fanControl.on.addEventListener('click', () => {
            setFanState(fanId, 'On');
        });

        fanControl.off.addEventListener('click', () => {
            setFanState(fanId, 'Off');
        });

        // Set up Firebase listeners for fan states
        const fanRef = ref(database, `bay 1/controls/${fanId}`);
        onValue(fanRef, (snapshot) => {
            const status = snapshot.val() || 'Off';
            fanControl.status = status;
            updateFanButton(fanControl);
            updateFanStatus();
        });
    });

    // Function to update the fan status display
    function updateFanStatus() {
        if (elements.fanStatusElement) {
            elements.fanStatusElement.innerHTML = ''; // Clear previous status
            fanControls.forEach((fanControl, index) => {
                const statusText = `Fan ${index + 1}: ${fanControl.status}`;
                elements.fanStatusElement.innerHTML += (index > 0 ? '<br>' : '') + statusText;
            });
        }
    }

    // Set values functionality
    const setValueInputs = {
        soilMoisture: document.getElementById('soil-moisture-input'),
        temperature: document.getElementById('temperature-input'),
        humidity: document.getElementById('humidity-input')
    };

    const setValueButtons = {
        soilMoisture: document.getElementById('set-soil-moisture-btn'),
        temperature: document.getElementById('set-temperature-btn'),
        humidity: document.getElementById('set-humidity-btn')
    };

    // Filter out any undefined elements
    Object.keys(setValueInputs).forEach(key => {
        if (!setValueInputs[key]) delete setValueInputs[key];
    });

    Object.keys(setValueButtons).forEach(key => {
        if (!setValueButtons[key]) delete setValueButtons[key];
    });

    function setValueForBay(valueType, value) {
        const setValueRef = ref(database, `bay 1/set values/${valueType}`);
        set(setValueRef, value)
            .then(() => {
                showPopup(`${valueType.charAt(0).toUpperCase() + valueType.slice(1)} set to ${value} for Bay 1`);
                if (setValueInputs[valueType]) {
                    setValueInputs[valueType].value = value; // Update the input box with the new value
                }
            })
            .catch((error) => {
                console.error(`Error setting ${valueType}:`, error);
                showPopup(`Error setting ${valueType}. Please try again.`);
            });
    }

    Object.keys(setValueButtons).forEach(valueType => {
        if (setValueButtons[valueType] && setValueInputs[valueType]) {
            setValueButtons[valueType].addEventListener('click', () => {
                const value = parseFloat(setValueInputs[valueType].value);
                if (!isNaN(value) && value >= 0 && value <= 100) {
                    setValueForBay(valueType, value);
                } else {
                    showPopup(`Please enter a valid ${valueType} between 0 and 100`);
                }
            });

            // Set up Firebase listeners for set values
            const setValueRef = ref(database, `bay 1/set values/${valueType}`);
            onValue(setValueRef, (snapshot) => {
                const value = snapshot.val();
                if (value !== null) {
                    setValueInputs[valueType].value = value;
                }
            });
        }
    });

    // Function to show node-specific popup
    function showNodePopup(node, popup) {
        if (popup) {
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
    }

    function hideNodePopup(popup) {
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }
    }

    function updateNodeData(nodeId, popup) {
        if (popup) {
            const popupContent = popup.querySelector('.popup-content');
            if (popupContent) {
                popupContent.innerHTML = '';

                const nodeData = ['temperature', 'humidity', 'soilMoisture', 'lastReading'];
                nodeData.forEach(type => {
                    const dataRef = ref(database, `bay 1/${nodeId}/${type}`);
                    onValue(dataRef, snapshot => {
                        const value = snapshot.val();
                        popupContent.innerHTML += `<p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${value}</p>`;
                    });
                });
            }
        }
    }

    // Function to handle interaction with nodes
    function handleNodeInteraction(nodeId) {
        const node = document.querySelector(`.node.${nodeId}`);
        const popup = document.getElementById(`popup-${nodeId}`);

        if (node && popup) {
            node.addEventListener('mouseenter', () => {
                updateNodeData(nodeId, popup);
                showNodePopup(node, popup);
            });

            node.addEventListener('mouseleave', () => {
                hideNodePopup(popup);
            });

            node.addEventListener('click', (event) => {
                event.preventDefault();
                const nodeNumber = nodeId.replace('node', '');
                window.location.href = `node${nodeNumber}.html`;
            });
        }
    }

    // Initialize all node interactions
    if (elements.nodes) {
        elements.nodes.forEach(node => {
            const nodeId = node.classList[1];
            handleNodeInteraction(nodeId);
        });
    }

    // Update average measurements for Bay 1
    function updateAverageMeasurements() {
        // References to the Firebase database paths
        const averageRefs = {
            temperature: ref(database, 'bay 1/Average/Temperature'),
            humidity: ref(database, 'bay 1/Average/Humidity'),
            soilMoisture: ref(database, 'bay 1/Average/Soil_moisture')
        };

        // Update the DOM elements with the average values from Firebase
        onValue(averageRefs.temperature, (snapshot) => {
            const avgTemperature = snapshot.val();
            const avgTempElement = document.getElementById('avg-temperature');
            if (avgTempElement) {
                avgTempElement.textContent = avgTemperature.toFixed(1);
            }
            controlFansAutomatically(parseFloat(avgTemperature));
        });

        onValue(averageRefs.humidity, (snapshot) => {
            const avgHumidity = snapshot.val();
            const avgHumidityElement = document.getElementById('avg-humidity');
            if (avgHumidityElement) {
                avgHumidityElement.textContent = avgHumidity.toFixed(1);
            }
        });

        onValue(averageRefs.soilMoisture, (snapshot) => {
            const avgSoilMoisture = snapshot.val();
            const avgSoilMoistureElement = document.getElementById('avg-soil-moisture');
            if (avgSoilMoistureElement) {
                avgSoilMoistureElement.textContent = avgSoilMoisture.toFixed(1);
            }
        });
    }


    // Function to control fans automatically based on average temperature
    function controlFansAutomatically(temperature) {
        fanControls.forEach((fanControl, index) => {
            if (fanControl.status === 'Auto') {
                let newState = 'Auto';
                if (temperature > 28) {
                    newState = 'On';
                } else if (temperature > 25 && index < 2) {
                    newState = 'On';
                } else if (temperature > 22 && index === 0) {
                    newState = 'On';
                }
                if (newState !== fanControl.status && newState !== 'Auto') {
                    setFanState(`fan${index + 1}`, newState);
                }
            }
        });
    }

    // Initialize all necessary interactions and updates
    
    updateAverageMeasurements();
updateFanStatus();

    // Periodically update average measurements
    setInterval(updateAverageMeasurements, 10000);
});
