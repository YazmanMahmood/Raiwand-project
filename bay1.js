document.addEventListener('DOMContentLoaded', () => {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    let totalTemp = 0, totalHumidity = 0, totalSoil = 0;

    nodes.forEach((node, index) => {
        const temp = (Math.random() * 40).toFixed(1);
        const humidity = (Math.random() * 100).toFixed(1);
        const soil = (Math.random() * 100).toFixed(1);
        const lastReading = new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        document.getElementById(`temp${node}`).textContent = `${temp}°C`;
        document.getElementById(`humidity${node}`).textContent = `${humidity}%`;
        document.getElementById(`soil${node}`).textContent = `${soil}%`;
        document.getElementById(`reading${node}`).textContent = lastReading;

        totalTemp += parseFloat(temp);
        totalHumidity += parseFloat(humidity);
        totalSoil += parseFloat(soil);
    });

    const avgTemp = (totalTemp / nodes.length).toFixed(1);
    const avgHumidity = (totalHumidity / nodes.length).toFixed(1);
    const avgSoil = (totalSoil / nodes.length).toFixed(1);

    document.getElementById('avg-temp').textContent = `${avgTemp}°C`;
    document.getElementById('avg-humidity').textContent = `${avgHumidity}%`;
    document.getElementById('avg-soil').textContent = `${avgSoil}%`;

    const waterSupplyStatus = Math.random() > 0.5 ? 'On' : 'Off';
    const fanStatus = Math.random() > 0.5 ? 'On' : 'Off';

    document.getElementById('water-supply-status').textContent = waterSupplyStatus;
    document.getElementById('fan-status').textContent = fanStatus;
});

function redirectToBay1() {
    window.location.href = "bay1.html";
}
