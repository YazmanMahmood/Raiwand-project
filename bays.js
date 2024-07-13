document.addEventListener('DOMContentLoaded', () => {
    const bays = document.querySelectorAll('.bay');

    // Add a data div to each bay for displaying the data
    bays.forEach(bay => {
        const dataDiv = document.createElement('div');
        dataDiv.classList.add('bay-data');
        bay.appendChild(dataDiv);
    });

    // Click event listener for each bay
    bays.forEach(bay => {
        bay.addEventListener('click', () => {
            // Reset all bays first
            bays.forEach(b => {
                b.classList.remove('expanded');
                const dataDiv = b.querySelector('.bay-data');
                if (dataDiv) {
                    dataDiv.style.display = 'none';
                }
            });

            // Expand clicked bay
            bay.classList.add('expanded');
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv) {
                dataDiv.style.display = 'flex';
            }

            // Redirect to specific bay page on click
            if (bay.id === 'bay-1') {
                window.location.href = 'bay1.html'; // Replace with actual URL
            } else if (bay.id === 'bay-2') {
                window.location.href = 'bay2.html'; // Replace with actual URL
            }
            // Add more conditions for other bays as needed
        });

        // Hover event listener for each bay
        bay.addEventListener('mouseover', () => {
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv) {
                let temp, humidity, soilMoisture;

                // Simulate data for Bay 1 (replace with actual data fetching logic)
                if (bay.id === 'bay-1') {
                    temp = 24; // Dummy temperature value for Bay 1
                    humidity = 60; // Dummy humidity value for Bay 1
                    soilMoisture = 45; // Dummy soil moisture value for Bay 1

                    // Display data in the bay-data div
                    dataDiv.innerHTML = `
                        <p>Temperature: ${temp}°C</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Soil Moisture: ${soilMoisture}%</p>
                    `;
                    dataDiv.style.display = 'flex';
                } else {
                    // For other bays, hide the bay-data div on hover
                    dataDiv.style.display = 'none';
                }
            }
        });

        // Mouseleave event listener for each bay
        bay.addEventListener('mouseleave', () => {
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv && !bay.classList.contains('expanded')) {
                dataDiv.style.display = 'none';
            }
        });
    });
});
