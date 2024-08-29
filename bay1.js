import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        popup: document.getElementById('popup'),
        popupMessage: document.getElementById('popup-message'),
        popupClose: document.getElementById('popup-close'),
        nodes: document.querySelectorAll('.node'),
        fanStatusElement: document.getElementById('fan-status'),
        waterFlowStatusElement: document.getElementById('water-flow-status'),
        dropdownBtns: document.querySelectorAll('.dropdown-btn'),
        sidePanelSections: document.querySelectorAll('.side-panel .section'),
        settingsLink: document.querySelector('a[href="settings.html"]'),
        errorBox: document.getElementById('error-box'),
        errorMessage: document.getElementById('error-message'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        avgTemperature: document.getElementById('avg-temperature'),
        avgHumidity: document.getElementById('avg-humidity'),
        avgSoilMoisture: document.getElementById('avg-soil-moisture'),
        hamburger: document.getElementById('hamburger-btn'),
        lastReading: document.getElementById('last-reading'),
        commentInput: document.getElementById('comment-input'),
        postCommentBtn: document.getElementById('post-comment'),
        commentsContainer: document.getElementById('comments-container'),
        deleteAllCommentsBtn: document.getElementById('delete-all-comments'),
    };

    // Sidebar functionality
    elements.hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.hamburger.classList.toggle('active');
        elements.sidebar.classList.toggle('open');
        elements.mainContent.classList.toggle('shifted');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (event) => {
        const isSidebarOpen = elements.sidebar.classList.contains('open');
        const clickedInsideSidebar = elements.sidebar.contains(event.target);
        const clickedHamburger = elements.hamburger.contains(event.target);

        if (isSidebarOpen && !clickedInsideSidebar && !clickedHamburger) {
            elements.hamburger.classList.remove('active');
            elements.sidebar.classList.remove('open');
            elements.mainContent.classList.remove('shifted');
        }
    });

    // Prevent sidebar from closing when clicking inside it
    elements.sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Dropdown functionality for sidebar
    elements.dropdownBtns.forEach((dropdownBtn) => {
        dropdownBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            const dropdownContainer = this.nextElementSibling;
            if (dropdownContainer.style.maxHeight) {
                dropdownContainer.style.maxHeight = null;
            } else {
                dropdownContainer.style.maxHeight = dropdownContainer.scrollHeight + 'px';
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.matches('.dropdown-btn')) {
            const dropdowns = document.getElementsByClassName('dropdown-container');
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.style.maxHeight) {
                    openDropdown.style.maxHeight = null;
                    openDropdown.previousElementSibling.classList.remove('active');
                }
            }
        }
    });

    function adjustForMobile() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);

        if (isMobile) {
            elements.sidebar.style.width = '0';
            elements.mainContent.style.marginLeft = '0';
        } else {
            elements.sidebar.style.width = '200px';
            elements.mainContent.style.marginLeft = '240px';
        }
    }

    window.addEventListener('resize', adjustForMobile);
    adjustForMobile(); // Call once on load

    // Existing functionality for fan controls, water controls, and other features from bay1.js...
    const fanControls = ['fan1', 'fan2', 'fan3'].map(fanId => ({
        auto: document.getElementById(`${fanId}-auto`),
        on: document.getElementById(`${fanId}-on`),
        off: document.getElementById(`${fanId}-off`),
        status: 'OFF'
    })).filter(control => control.auto && control.on && control.off);

    const waterControls = ['valve1', 'valve2', 'valve3'].map(valveId => ({
        auto: document.getElementById(`${valveId}-auto`),
        on: document.getElementById(`${valveId}-on`),
        off: document.getElementById(`${valveId}-off`),
        status: 'OFF'
    })).filter(control => control.auto && control.on && control.off);

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

    function adjustSidePanelHeights() {
        elements.sidePanelSections.forEach(section => {
            const title = section.querySelector('h2');
            const content = section.querySelector('.status-item, .measurement-item, .fan-control, .water-control, .set-value-widget');
            if (title && content) {
                section.style.minHeight = `${title.offsetHeight + content.offsetHeight + 40}px`;
            }
        });
    }

    function showPopup(message) {
        if (elements.popup && elements.popupMessage) {
            elements.popupMessage.textContent = message;
            elements.popup.style.display = 'block';
            setTimeout(() => elements.popup.classList.add('show'), 10);
        }
    }

    function hidePopup() {
        if (elements.popup) {
            elements.popup.classList.remove('show');
            setTimeout(() => elements.popup.style.display = 'none', 0);
        }
    }

    function showError(message) {
        elements.errorMessage.innerHTML = message;
        elements.errorBox.style.display = 'block';
    }

    function hideError() {
        elements.errorBox.style.display = 'none';
    }

    function checkForErrors(data) {
        const errorCodes = {
            '001': { message: 'Power supply loss', color: '#FF9800' },
            '002': { message: 'DHT sensor down', color: '#F44336' },
            '003': { message: 'Battery low', color: '#FFC107' },
            '004': { message: 'Connection lost', color: '#9C27B0' },
            '005': { message: 'Sensor + low battery', color: '#E91E63' },
            '006': { message: 'Sensor + power supply', color: '#673AB7' },
            '007': { message: 'Low battery + power supply', color: '#3F51B5' },
            '008': { message: 'Sensor + battery + power supply', color: '#2196F3' }
        };

        const allErrorMessages = Object.entries(data).reduce((acc, [nodeName, nodeData]) => {
            if (nodeData && nodeName.startsWith('node ')) {
                const nodeErrors = [];
                if (nodeData.Power_1_status === 0 && nodeData.DHT_check === 0 && nodeData.Battery === 0) nodeErrors.push('008');
                else if (nodeData.Battery === 0 && nodeData.Power_1_status === 0) nodeErrors.push('007');
                else if (nodeData.DHT_check === 0 && nodeData.Power_1_status === 0) nodeErrors.push('006');
                else if (nodeData.DHT_check === 0 && nodeData.Battery === 0) nodeErrors.push('005');
                else if (nodeData.active === 0) nodeErrors.push('004');
                else if (nodeData.Battery === 0) nodeErrors.push('003');
                else if (nodeData.DHT_check === 0) nodeErrors.push('002');
                else if (nodeData.Power_1_status === 0) nodeErrors.push('001');

                if (nodeErrors.length) {
                    const errorLinks = nodeErrors.map(code =>
                        `<a href="${nodeName.replace(' ', '')}.html" style="color: ${errorCodes[code].color};">Error: ${code}</a>`
                    );
                    acc.push(`<strong>${nodeName.charAt(0).toUpperCase() + nodeName.slice(1)}</strong>: ${errorLinks.join(', ')}`);
                }
            }
            return acc;
        }, []);

        allErrorMessages.length ? showError(allErrorMessages.join('<br><br>')) : hideError();
    }

    function updateFanButton(fanControl) {
        ['auto', 'on', 'off'].forEach(state => 
            fanControl[state].classList.toggle('active', fanControl.status.toLowerCase() === state));
    }

    function setFanState(fanId, status) {
        const fanRef = ref(database, `bay 1/controls/${fanId}`);
        set(fanRef, status).catch((error) => handleError(error, `setting fan state for ${fanId}`));
    }

    fanControls.forEach((fanControl, index) => {
        const fanId = `fan${index + 1}`;
        ['auto', 'on', 'off'].forEach(state => {
            fanControl[state].addEventListener('click', () => setFanState(fanId, state.charAt(0).toUpperCase() + state.slice(1)));
        });

        const fanRef = ref(database, `bay 1/controls/${fanId}`);
        onValue(fanRef, (snapshot) => {
            fanControl.status = snapshot.val() || 'Off';
            updateFanButton(fanControl);
            updateFanStatus();
        });
    });

    function updateFanStatus() {
        if (elements.fanStatusElement) {
            elements.fanStatusElement.innerHTML = fanControls.map((fanControl, index) => 
                `Fan ${index + 1}: ${fanControl.status}`).join('<br>');
        }
    }

    function updateWaterFlowStatus() {
        const waterFlowRef = ref(database, 'bay 1/controls/water_flow');
        onValue(waterFlowRef, (snapshot) => {
            if (elements.waterFlowStatusElement) {
                elements.waterFlowStatusElement.textContent = snapshot.val() || 'OFF';
            }
        });
    }

    function setValueForBay(valueType, value) {
        const setValuePaths = {
            soilMoisture: 'bay 1/set values/soil_moisture',
            temperature: 'bay 1/set values/temperature',
            humidity: 'bay 1/set values/humidity'
        };

        const path = setValuePaths[valueType] || `bay 1/set values/${valueType}`;
        const setValueRef = ref(database, path);

        set(setValueRef, value)
            .then(() => {
                showPopup(`${valueType.charAt(0).toUpperCase() + valueType.slice(1)} set to ${value} for Bay 1`);
                if (setValueInputs[valueType]) {
                    setValueInputs[valueType].value = value;
                }
            })
            .catch((error) => {
                handleError(error, `setting ${valueType}`);
                showPopup(`Error setting ${valueType}. Please try again.`);
            });
    }

    function fetchAndDisplaySoilMoisture() {
        const soilMoistureRef = ref(database, 'bay 1/set values/soil_moisture');
        onValue(soilMoistureRef, (snapshot) => {
            const value = snapshot.val();
            if (value !== null && setValueInputs.soilMoisture) {
                setValueInputs.soilMoisture.value = value;
            }
        });
    }

    fetchAndDisplaySoilMoisture();

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

            const setValueRef = ref(database, `bay 1/set values/${valueType}`);
            onValue(setValueRef, (snapshot) => {
                const value = snapshot.val();
                if (value !== null) {
                    setValueInputs[valueType].value = value;
                }
            });
        }
    });

    function showNodePopup(node, popup) {
        if (popup && node) {
            const rect = node.getBoundingClientRect();
            const popupRect = popup.getBoundingClientRect();

            const isLeftSide = ['node1', 'node3', 'node5'].includes(node.classList[1]);
            const top = Math.max(10, rect.top + window.scrollY + rect.height / 2 - popupRect.height / 2);
            const left = Math.max(10, isLeftSide ? rect.left - popupRect.width - 15 : rect.right + 15);

            popup.style.top = `${top}px`;
            popup.style.left = `${left}px`;

            popup.style.display = 'block';
            setTimeout(() => popup.classList.add('show'), 10);
        } else {
            console.error("Popup or node not found:", node, popup);
        }
    }

    function hideNodePopup(popup) {
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => popup.style.display = 'none', 100); // Hide after 100ms on mouse leave
        }
    }

    function updateNodeData(nodeId, popup) {
        if (popup) {
            const popupContent = popup.querySelector('.popup-content');
            if (popupContent) {
                popupContent.innerHTML = '';
                const nodeNumber = nodeId.replace('node', '');
                ['temperature', 'humidity', 'soil_moisture'].forEach(type => {
                    const dataRef = ref(database, `bay 1/node ${nodeNumber}/${type}`);
                    onValue(dataRef, snapshot => {
                        const value = snapshot.val();
                        let displayValue = value !== null ? value.toFixed(2) : 'N/A';
                        if (type === 'temperature') {
                            displayValue += '°C';
                        } else if (type === 'humidity' || type === 'soil_moisture') {
                            displayValue += '%';
                        }
                        popupContent.innerHTML += `<p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${displayValue}</p>`;
                    });
                });
            }
        }
    }

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
                window.location.href = `${nodeId}.html`;
            });
        } else {
            console.error(`Node or popup not found for ${nodeId}`);
        }
    }

    function initializeAllPopups() {
        for (let i = 1; i <= 6; i++) {
            handleNodeInteraction(`node${i}`);
        }
    }

    function updateAverageMeasurements() {
        const total = { temperature: 0, humidity: 0, soilMoisture: 0 };
        let count = 0;

        for (let i = 1; i <= 6; i++) {
            const nodePath = `bay 1/node ${i}`;
            ['temperature', 'humidity', 'soil_moisture'].forEach(type => {
                const dataRef = ref(database, `${nodePath}/${type}`);
                onValue(dataRef, (snapshot) => {
                    const value = parseFloat(snapshot.val());
                    if (!isNaN(value)) {
                        total[type] += value;
                        count++;
                    }

                    if (count > 0) {
                        const avgValue = (total[type] / count).toFixed(2);
                        const avgElement = document.getElementById(`avg-${type.replace('_', '-')}`);
                        if (avgElement) {
                            avgElement.textContent = `${avgValue}${type === 'temperature' ? '°C' : '%'}`;
                        }
                    }
                });
            });
        }
    }

    function controlFansAutomatically(temperature) {
        fanControls.forEach((fanControl, index) => {
            if (fanControl.status === 'Auto') {
                let newState = 'Auto';
                if (temperature > 28 || (temperature > 25 && index < 2) || (temperature > 22 && index === 0)) {
                    newState = 'On';
                }
                if (newState !== fanControl.status && newState !== 'Auto') {
                    setFanState(`fan${index + 1}`, newState);
                }
            }
        });
    }

    function initializeWaterControls() {
        waterControls.forEach((control, index) => {
            const valveId = `valve${index + 1}`;

            ['auto', 'on', 'off'].forEach(state => {
                control[state].addEventListener('click', () => setWaterState(valveId, state.charAt(0).toUpperCase() + state.slice(1)));
            });

            const valveRef = ref(database, `bay 1/controls/${valveId}`);
            onValue(valveRef, (snapshot) => {
                control.status = snapshot.val() || 'Off';
                updateWaterButton(control);
                updateWaterFlowStatus();
            });
        });
    }

    function setWaterState(valveId, status) {
        const valveRef = ref(database, `bay 1/controls/${valveId}`);
        set(valveRef, status).catch((error) => handleError(error, `setting water state for ${valveId}`));
    }

    function updateWaterButton(control) {
        ['auto', 'on', 'off'].forEach(state => 
            control[state].classList.toggle('active', control.status.toLowerCase() === state));
    }

    function adjustTextSizes() {
        elements.sidePanelSections.forEach(container => {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const fontSize = Math.min(containerWidth * 0.05, containerHeight * 0.1);
            container.style.fontSize = `${fontSize}px`;
        });
    }

    function handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        showPopup(`An error occurred while ${context}. Please try again or contact support.`);
    }

    function initializeFirebaseListeners() {
        const bayRef = ref(database, 'bay 1');
        onValue(bayRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                checkForErrors(data);
                updateAverageMeasurements();
                controlFansAutomatically(data.temperature);
            }
        });
    }

    try {
        adjustSidePanelHeights();
        initializeWaterControls();
        adjustForMobile();
        initializeAllPopups();
        updateAverageMeasurements();
        initializeFirebaseListeners();

        window.addEventListener('resize', adjustSidePanelHeights);
        window.addEventListener('resize', adjustForMobile);
        window.addEventListener('resize', adjustTextSizes);
        window.addEventListener('load', adjustTextSizes);

        if (elements.settingsLink) {
            elements.settingsLink.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = 'settings.html';
            });
        }

        if (elements.popupClose) {
            elements.popupClose.addEventListener('click', hidePopup);
        }

        if (elements.mobileToggle) {
            elements.mobileToggle.addEventListener('click', () => {
                elements.sidebar.classList.toggle('active');
                const isSidebarActive = elements.sidebar.classList.contains('active');
                elements.sidebar.style.width = isSidebarActive ? '50%' : '0';
                elements.mainContent.style.marginLeft = isSidebarActive ? '50%' : '0';
            });
        }

    } catch (error) {
        handleError(error, 'initializing the application');
    }
});
