document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Function to toggle sidebar and hamburger button
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            hamburger.style.left = '215px';
        } else {
            hamburger.style.left = '15px';
        }
    });

    // Close sidebar when clicking outside
    mainContent.addEventListener('click', () => {
        if (sidebar.classList.contains('open') && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.style.left = '15px';
        }
    });

    // Update layout on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.style.left = '15px';
            mainContent.style.marginLeft = '200px'; // Adjust margin as needed
        } else {
            mainContent.style.marginLeft = '0';
        }
    });

    // Function to handle node interactions
    function handleNodeInteraction(nodeId) {
        const node = document.querySelector(`.node.${nodeId}`);
        const popup = document.getElementById(`popup-${nodeId}`);

        node.addEventListener('mouseenter', () => {
            showPopup(node, popup);
        });

        node.addEventListener('mouseleave', () => {
            hidePopup(popup);
        });

        node.addEventListener('click', () => {
            window.location.href = `node${nodeId.replace('node', '')}.html`; // Replace with actual redirection logic
        });
    }

    // Function to show popup
    function showPopup(node, popup) {
        popup.style.display = 'block';

        // Position the popup relative to the node
        const rect = node.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        let top = rect.top + window.scrollY + rect.height / 2 - popupRect.height / 2;
        let left;

        const popupArrow = popup.querySelector('.popup-arrow');

        // Determine if the popup should be on the left or right side of the node
        if (['node1', 'node3', 'node5'].includes(node.classList[1])) {
            left = rect.left - popupRect.width - 15;
            popupArrow.classList.remove('popup-arrow-left');
            popupArrow.classList.add('popup-arrow-right');
        } else {
            left = rect.right + 15;
            popupArrow.classList.remove('popup-arrow-right');
            popupArrow.classList.add('popup-arrow-left');
        }

        // Adjust if popup goes out of viewport
        if (top + popupRect.height > window.innerHeight) {
            top = window.innerHeight - popupRect.height - 10;
        }
        if (top < 0) {
            top = 10;
        }
        if (left < 0) {
            left = 10;
        }
        if (left + popupRect.width > window.innerWidth) {
            left = window.innerWidth - popupRect.width - 10;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        // Add animation class after a short delay
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
    }

    // Function to hide popup
    function hidePopup(popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); // Wait for the animation to complete
    }

    // Loop through all nodes and add event listeners
    document.querySelectorAll('.node').forEach((node) => {
        const nodeId = node.classList[1]; // Assumes node classes are like 'node1', 'node2', etc.
        handleNodeInteraction(nodeId);
    });

    // Add event listener for window resize to reposition popups
    window.addEventListener('resize', () => {
        document.querySelectorAll('.popup').forEach((popup) => {
            if (popup.style.display === 'block') {
                const nodeId = popup.id.replace('popup-', '');
                const node = document.querySelector(`.node.${nodeId}`);
                showPopup(node, popup);
            }
        });
    });

    // Function to update popup content with random values and more information
    function updatePopupContent(nodeId) {
        const temperature = (Math.random() * (30 - 20) + 20).toFixed(1);
        const humidity = Math.floor(Math.random() * (80 - 40) + 40);
        const soilMoisture = Math.floor(Math.random() * (100 - 20) + 20);

        const popupContent = document.getElementById(`popup-content-${nodeId}`);
        popupContent.innerHTML = `
            <h2>Node ${nodeId.replace('node', '')} Information</h2>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Soil Moisture:</strong> ${soilMoisture}%</p>
            <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
        `;
    }

    // Update popup content on hover
    document.querySelectorAll('.node').forEach((node) => {
        const nodeId = node.classList[1]; // Assumes node classes are like 'node1', 'node2', etc.
        node.addEventListener('mouseenter', () => {
            updatePopupContent(nodeId);
        });
    });

    // Initial update of popup content
    document.querySelectorAll('.popup-content').forEach((popupContent) => {
        const nodeId = popupContent.id.replace('popup-content-', '');
        updatePopupContent(nodeId);
    });

    // Toggle dropdown on button click
    document.querySelectorAll('.dropdown-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const dropdownContainer = btn.nextElementSibling;
            dropdownContainer.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', (event) => {
        const dropdowns = document.querySelectorAll('.dropdown-container');
        dropdowns.forEach((dropdown) => {
            if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-btn')) {
                dropdown.classList.remove('show');
            }
        });
    });

    // Function to update average measurements
    function updateAverageMeasurements() {
        const temperatures = [];
        const humidities = [];
        const soilMoistures = [];

        document.querySelectorAll('.popup-content').forEach(content => {
            const tempMatch = content.innerHTML.match(/Temperature:<\/strong> ([\d.]+)°C/);
            const humidityMatch = content.innerHTML.match(/Humidity:<\/strong> ([\d.]+)%/);
            const soilMoistureMatch = content.innerHTML.match(/Soil Moisture:<\/strong> ([\d.]+)%/);

            if (tempMatch) temperatures.push(parseFloat(tempMatch[1]));
            if (humidityMatch) humidities.push(parseFloat(humidityMatch[1]));
            if (soilMoistureMatch) soilMoistures.push(parseFloat(soilMoistureMatch[1]));
        });

        const avgTemperature = temperatures.length ? (temperatures.reduce((a, b) => a + b) / temperatures.length).toFixed(1) : '--';
        const avgHumidity = humidities.length ? Math.round(humidities.reduce((a, b) => a + b) / humidities.length) : '--';
        const avgSoilMoisture = soilMoistures.length ? Math.round(soilMoistures.reduce((a, b) => a + b) / soilMoistures.length) : '--';

        document.getElementById('avg-temperature').textContent = avgTemperature;
        document.getElementById('avg-humidity').textContent = avgHumidity;
        document.getElementById('avg-soil-moisture').textContent = avgSoilMoisture;
    }

    // Update average measurements on initial load
    updateAverageMeasurements();

    // Update average measurements every 10 seconds
    setInterval(updateAverageMeasurements, 10000); // Adjust interval as needed
});
