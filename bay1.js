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
        popup: document.querySelector('.set-value-popup'),
        popupMessage: document.getElementById('set-value-message'),
        popupClose: document.querySelector('.set-value-close'),
        nodes: document.querySelectorAll('.node'),
        fanStatusElement: document.getElementById('fan-status'),
        waterFlowStatusElement: document.getElementById('water-valve-status'),
        waterMeshStatusElement: document.getElementById('water-mesh-status'),
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
    };

    let fanControls = [];
    let waterControls = [];
    let waterMeshControl = {};

    // Sidebar functionality
    function toggleSidebar(e) {
        e.stopPropagation();
        elements.hamburger.classList.toggle('active');
        elements.sidebar.classList.toggle('open');
        elements.mainContent.classList.toggle('shifted');
    }

    function closeSidebarOnOutsideClick(event) {
        if (elements.sidebar.classList.contains('open') &&
            !elements.sidebar.contains(event.target) &&
            !elements.hamburger.contains(event.target)) {
            elements.hamburger.classList.remove('active');
            elements.sidebar.classList.remove('open');
            elements.mainContent.classList.remove('shifted');
        }
    }

    // Dropdown functionality
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

    // Responsive design functions
    function adjustForMobile() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
        elements.sidebar.style.width = isMobile ? '0' : '200px';
        elements.mainContent.style.marginLeft = isMobile ? '0' : '240px';
    }

    function adjustSidePanelHeights() {
        elements.sidePanelSections.forEach(section => {
            const title = section.querySelector('h2');
            const content = section.querySelector('.status-item, .measurement-item, .fan-control, .water-control, .set-value-widget');
            if (title && content) {
                section.style.minHeight = `${title.offsetHeight + content.offsetHeight + 40}px`;
            }
        });
    }

    function adjustTextSizes() {
        elements.sidePanelSections.forEach(container => {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const fontSize = Math.min(containerWidth * 0.05, containerHeight * 0.1);
            container.style.fontSize = `${fontSize}px`;
        });
    }

    // Popup management
    function showPopup(message) {
        if (elements.popup && elements.popupMessage) {
            elements.popupMessage.textContent = message;
            elements.popup.style.display = 'block';
            requestAnimationFrame(() => elements.popup.classList.add('show'));
            window.addEventListener('click', closePopupOnOutsideClick);
        }
    }

    function hidePopup() {
        if (elements.popup) {
            elements.popup.classList.remove('show');
            setTimeout(() => {
                elements.popup.style.display = 'none';
            }, 300);
            window.removeEventListener('click', closePopupOnOutsideClick);
        }
    }

    function closePopupOnOutsideClick(event) {
        if (elements.popup && !elements.popup.contains(event.target) && !elements.popupMessage.contains(event.target)) {
            hidePopup();
        }
    }

    // Error handling
    function showError(message) {
        elements.errorMessage.innerHTML = message;
        elements.errorMessage.style.color = '#FF0000';
        elements.errorBox.style.display = 'block';
    }

    function hideError() {
        elements.errorBox.style.display = 'none';
    }

    function handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        showPopup(`An error occurred while ${context}. Please try again or contact support.`);
    }

    // Value controls
    function initializeSetValueControls() {
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
    
        Object.keys(setValueButtons).forEach(valueType => {
            if (setValueButtons[valueType] && setValueInputs[valueType]) {
                // Get correct path for each value type
                const setValuePaths = {
                    soilMoisture: 'bay 1/set values/soil_moisture',
                    temperature: 'bay 1/set values/temperature',
                    humidity: 'bay 1/set values/humidity'
                };
                
                const path = setValuePaths[valueType];
                const setValueRef = ref(database, path);
                
                // Initialize with current values
                onValue(setValueRef, (snapshot) => {
                    const value = snapshot.val();
                    if (value !== null) {
                        setValueInputs[valueType].value = Math.floor(value);
                    }
                });
    
                // Set up button click handlers
                setValueButtons[valueType].addEventListener('click', () => {
                    const value = Math.floor(parseFloat(setValueInputs[valueType].value));
                    if (!isNaN(value) && value >= 0 && value <= 100) {
                        setValueForBay(valueType, value);
                    } else {
                        showPopup(`Please enter a valid ${valueType} value between 0 and 100`);
                    }
                });
            }
        });
    }
    
    function setValueForBay(valueType, value) {
        const setValuePaths = {
            soilMoisture: 'bay 1/set values/soil_moisture',
            temperature: 'bay 1/set values/temperature',
            humidity: 'bay 1/set values/humidity'
        };

        const path = setValuePaths[valueType];
        const setValueRef = ref(database, path);

        set(setValueRef, value)
            .then(() => {
                showPopup(`${valueType.charAt(0).toUpperCase() + valueType.slice(1)} set to ${value} for Bay 1`);
            })
            .catch((error) => {
                handleError(error, `setting ${valueType}`);
                showPopup(`Error setting ${valueType}. Please try again.`);
            });
    }

    // Fan controls
    function initializeFanControls() {
        fanControls = ['fan1', 'fan2', 'fan3'].map(fanId => {
            const control = {
                auto: document.getElementById(`${fanId}-auto`),
                on: document.getElementById(`${fanId}-on`),
                off: document.getElementById(`${fanId}-off`),
                status: 'OFF'
            };
            
            if (control.auto && control.on && control.off) {
                ['auto', 'on', 'off'].forEach(state => {
                    control[state].addEventListener('click', () => setFanState(fanId, state.charAt(0).toUpperCase() + state.slice(1)));
                });

                const fanRef = ref(database, `bay1/controls/${fanId}`);
                onValue(fanRef, (snapshot) => { 
                    control.status = snapshot.val() || 'Off';
                    updateFanButton(control);
                    updateFanStatus();
                });
            }
            
            return control;
        }).filter(control => control.auto && control.on && control.off);
    }

    function setFanState(fanId, status) {
        const fanRef = ref(database, `bay1/controls/${fanId}`);
        set(fanRef, status).catch((error) => handleError(error, `setting fan state for ${fanId}`));
    }

    function updateFanButton(control) {
        ['auto', 'on', 'off'].forEach(state => 
            control[state].classList.toggle('active', control.status.toLowerCase() === state));
    }

    function updateFanStatus() {
        if (elements.fanStatusElement) {
            elements.fanStatusElement.innerHTML = fanControls.map((fanControl, index) => 
                `Fan ${index + 1}: ${fanControl.status}`).join('<br>');
        }
    }

    // Water controls
    function initializeWaterControls() {
        waterControls = ['water1', 'water2', 'water3'].map(valveId => {
            const control = {
                auto: document.getElementById(`${valveId}-auto`),
                on: document.getElementById(`${valveId}-on`),
                off: document.getElementById(`${valveId}-off`),
                status: 'OFF'
            };
            
            if (control.auto && control.on && control.off) {
                ['auto', 'on', 'off'].forEach(state => {
                    control[state].addEventListener('click', () => setWaterState(valveId, state.charAt(0).toUpperCase() + state.slice(1)));
                });

                const valveRef = ref(database, `bay1/controls/${valveId}`);
                onValue(valveRef, (snapshot) => {
                    control.status = snapshot.val() || 'Off';
                    updateWaterButton(control);
                    updateWaterFlowStatus();
                });
            }
            
            return control;
        }).filter(control => control.auto && control.on && control.off);
    }

    function setWaterState(valveId, status) {
        const valveRef = ref(database, `bay1/controls/${valveId}`);
        set(valveRef, status).catch((error) => handleError(error, `setting water state for ${valveId}`));
    }

    function updateWaterButton(control) {
        ['auto', 'on', 'off'].forEach(state => 
            control[state].classList.toggle('active', control.status.toLowerCase() === state));
    }

    function updateWaterFlowStatus() {
        if (elements.waterFlowStatusElement) {
            elements.waterFlowStatusElement.innerHTML = waterControls.map((control, index) =>
                `Valve ${index + 1}: ${control.status}`).join('<br>');
        }
    }

    // Water Mesh controls
    function initializeWaterMeshControls() {
        waterMeshControl = {
            auto: document.getElementById('water-mesh-auto'),
            on: document.getElementById('water-mesh-on'),
            off: document.getElementById('water-mesh-off'),
            status: 'OFF'
        };

        if (waterMeshControl.auto && waterMeshControl.on && waterMeshControl.off) {
            ['auto', 'on', 'off'].forEach(state => {
                waterMeshControl[state].addEventListener('click', () => 
                    setWaterMeshState(state.charAt(0).toUpperCase() + state.slice(1)));
            });

            const waterMeshRef = ref(database, 'bay1/controls/water_mesh');
            onValue(waterMeshRef, (snapshot) => {
                waterMeshControl.status = snapshot.val() || 'Off';
                updateWaterMeshButton(waterMeshControl);
                updateWaterMeshStatus();
            });
        }

        return waterMeshControl;
    }

    function setWaterMeshState(status) {
        const waterMeshRef = ref(database, 'bay1/controls/water_mesh');
        set(waterMeshRef, status).catch((error) => handleError(error, 'setting water mesh state'));
    }

    function updateWaterMeshButton(control) {
        ['auto', 'on', 'off'].forEach(state =>
            control[state].classList.toggle('active', control.status.toLowerCase() === state));
    }

    function updateWaterMeshStatus() {
        if (elements.waterMeshStatusElement) {
            elements.waterMeshStatusElement.textContent = waterMeshControl.status;
        }
    }

    // Node management
    function initializeAllPopups() {
        for (let i = 1; i <= 6; i++) {
            handleNodeInteraction(`node${i}`);
        }
    }

    function handleNodeInteraction(nodeId) {
        const node = document.querySelector(`.node.${nodeId}`);
        const popup = document.getElementById(`popup-${nodeId}`);

        if (node && popup) {
            let hideTimeout;
            
            node.addEventListener('mouseenter', () => {
                if (!isMobileView()) {
                    clearTimeout(hideTimeout);
                    updateNodeData(nodeId, popup);
                    showNodePopup(node, popup);
                }
            });

            node.addEventListener('mouseleave', () => {
                if (!isMobileView()) {
                    hideTimeout = setTimeout(() => hideNodePopup(popup), 50);
                }
            });

            popup.addEventListener('mouseenter', () => {
                if (!isMobileView()) {
                    clearTimeout(hideTimeout);
                }
            });

            popup.addEventListener('mouseleave', () => {
                if (!isMobileView()) {
                    hideTimeout = setTimeout(() => hideNodePopup(popup), 50);
                }
            });

            node.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `${nodeId}.html`;
            });
        }
    }

    function isMobileView() {
        return window.innerWidth <= 768;
    }

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
            requestAnimationFrame(() => popup.classList.add('show'));
        }
    }

    function hideNodePopup(popup) {
        if (popup) {
            popup.classList.remove('show');
            popup.style.display = 'none';
        }
    }

    function updateNodeData(nodeId, popup) {
        if (popup) {
            const popupContent = popup.querySelector('.popup-content');
            if (popupContent) {
                popupContent.innerHTML = '';
                const nodeNumber = nodeId.replace('node', '');
                const dataRef = ref(database, `bay 1/node ${nodeNumber}`);
                onValue(dataRef, snapshot => {
                    const data = snapshot.val();
                    if (data) {
                        ['temperature', 'humidity', 'soil_moisture'].forEach(type => {
                            const value = data[type];
                            let displayValue = value !== null && !isNaN(value) ? Math.floor(value) : 'N/A';
                            if (type === 'temperature') {
                                displayValue += '°C';
                            } else if (type === 'humidity' || type === 'soil_moisture') {
                                displayValue += '%';
                            }
                            popupContent.innerHTML += `<p><strong>${type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}:</strong> ${displayValue}</p>`;
                        });
                    }
                }, {
                    onlyOnce: true
                });
            }
        }
    }

    // Error checking
    function checkForErrors(data) {
        const errorCodes = {
            '001': { message: 'Power supply loss', color: '#FF0000' },
            '002': { message: 'DHT sensor down', color: '#FF0000' },
            '003': { message: 'Battery low', color: '#FF0000' },
            '004': { message: 'Connection lost', color: '#FF0000' },
            '005': { message: 'Sensor + low battery', color: '#FF0000' },
            '006': { message: 'Sensor + power supply', color: '#FF0000' },
            '007': { message: 'Low battery + power supply', color: '#FF0000' },
            '008': { message: 'Sensor + battery + power supply', color: '#FF0000' }
        };

        const allErrorMessages = Object.entries(data).reduce((acc, [nodeName, nodeData]) => {
            if (nodeData && nodeName.startsWith('node ')) {
                const nodeErrors = [];
                if (nodeData.active === 1) {
                    if (nodeData.Power_1_status === 1) {
                        if (nodeData.DHT_check === 0) {
                            nodeErrors.push('002');
                        }
                    } else {
                        if (nodeData.Battery === 0) {
                            nodeErrors.push('003');
                        }
                    }
                } else {
                    if (nodeData.Battery === 0) {
                        nodeErrors.push('003');
                    } else {
                        nodeErrors.push('Node down');
                    }
                }
                if (nodeErrors.length) {
                    const errorLinks = nodeErrors.map(code =>
                        `<a href="${nodeName.replace(' ', '')}.html" style="color: ${errorCodes[code] ? errorCodes[code].color : '#FF0000'};">${code ? 'Error: ' + code : 'Error'}</a>`
                    );
                    acc.push(`<strong>${nodeName.charAt(0).toUpperCase() + nodeName.slice(1)}</strong>: ${errorLinks.join(', ')}`);
                }
            }
            return acc;
        }, []);

        allErrorMessages.length ? showError(allErrorMessages.join('<br><br>')) : hideError();
    }

    // Average measurements
    function updateAverageMeasurements(data) {
        const total = { temperature: 0, humidity: 0, soil_moisture: 0 };
        let count = { temperature: 0, humidity: 0, soil_moisture: 0 };

        for (let i = 1; i <= 6; i++) {
            const nodeData = data[`node ${i}`];
            if (nodeData) {
                ['temperature', 'humidity', 'soil_moisture'].forEach(type => {
                    const value = Math.floor(parseFloat(nodeData[type]));
                    if (!isNaN(value)) {
                        total[type] += value;
                        count[type]++;
                    }
                });
            }
        }

        ['temperature', 'humidity', 'soil_moisture'].forEach(type => {
            if (count[type] > 0) {
                const avgValue = Math.floor(total[type] / count[type]);
                const avgElement = document.getElementById(`avg-${type.replace('_', '-')}`);
                if (avgElement) {
                    avgElement.textContent = `${avgValue}${type === 'temperature' ? '°C' : '%'}`;
                }
            }
        });
    }

    // Automatic fan control
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

    // Initialize Firebase listeners
    function initializeFirebaseListeners() {
        const bayRef = ref(database, 'bay 1');
        onValue(bayRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                checkForErrors(data);
                updateAverageMeasurements(data);
                controlFansAutomatically(data.temperature);
            }
        });

        initializeWaterMeshControls();
    }

    // Debounce function
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

    // Event listeners
    elements.hamburger.addEventListener('click', toggleSidebar);
    document.addEventListener('click', closeSidebarOnOutsideClick);
    elements.sidebar.addEventListener('click', (e) => e.stopPropagation());
    elements.dropdownBtns.forEach(btn => btn.addEventListener('click', toggleDropdown));
    document.addEventListener('click', closeDropdowns);

    // Window resize handling
    const debouncedResize = debounce(() => {
        adjustForMobile();
        adjustSidePanelHeights();
        adjustTextSizes();
    }, 250);
    window.addEventListener('resize', debouncedResize);

    // Initialize application
    try {
        adjustSidePanelHeights();
        adjustForMobile();
        adjustTextSizes();
        initializeSetValueControls();
        initializeFanControls();
        initializeWaterControls();
        initializeAllPopups();
        initializeFirebaseListeners();

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

        // Start the session timer
        import('./session-manager.js').then(module => {
            const { startSessionTimer } = module;
            startSessionTimer();
        });

    } catch (error) {
        handleError(error, 'initializing the application');
    }
});
