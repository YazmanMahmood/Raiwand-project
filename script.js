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
