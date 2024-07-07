<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const bays = document.querySelectorAll('.bay');
    
    // Add a data div to each bay for displaying the data
    bays.forEach(bay => {
        const dataDiv = document.createElement('div');
        dataDiv.classList.add('bay-data');
        bay.appendChild(dataDiv);
    });

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
        });

        bay.addEventListener('mouseover', () => {
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv) {
                let temp, humidity, soilMoisture;

                if (bay.id === 'bay-1') {
                    temp = 24; // Dummy temperature value for Bay 1
                    humidity = 60; // Dummy humidity value for Bay 1
                    soilMoisture = 45; // Dummy soil moisture value for Bay 1

                    dataDiv.innerHTML = `
                        <p>Temperature: ${temp}°C</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Soil Moisture: ${soilMoisture}%</p>
                    `;
                    dataDiv.style.display = 'flex';
                } else {
                    // For other bays, do nothing on hover
                    dataDiv.style.display = 'none';
                }
            }
        });

        bay.addEventListener('mouseleave', () => {
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv && !bay.classList.contains('expanded')) {
                dataDiv.style.display = 'none';
            }
        });
    });
});
=======
document.addEventListener('DOMContentLoaded', () => {
    const bays = document.querySelectorAll('.bay');

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
        });

        bay.addEventListener('mouseover', () => {
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv) {
                const temp = (Math.random() * 40).toFixed(1);
                const humidity = (Math.random() * 100).toFixed(1);
                const soilMoisture = (Math.random() * 100).toFixed(1);
                dataDiv.innerHTML = `
                    <p>Temperature: ${temp}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Soil Moisture: ${soilMoisture}%</p>
                `;
                dataDiv.style.display = 'flex';
            }
        });

        bay.addEventListener('mouseleave', () => {
            const dataDiv = bay.querySelector('.bay-data');
            if (dataDiv && !bay.classList.contains('expanded')) {
                dataDiv.style.display = 'none';
            }
        });
    });
});
>>>>>>> 4b397de718962720f73ea2cb07c879404d7b6142
