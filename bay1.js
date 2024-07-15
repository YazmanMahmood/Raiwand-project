function redirectToNode(nodePage) {
    window.location.href = nodePage;
}

document.addEventListener('DOMContentLoaded', () => {
    // Sample data for nodes (replace with actual dynamic data if available)
    const nodes = [
        { id: 'node1', temperature: '22.5°C', humidity: '55%', soilMoisture: '40%', waterSupply: 'On', fanStatus: 'Off', reading: '22:30, July 13' },
        { id: 'node2', temperature: '23.0°C', humidity: '50%', soilMoisture: '42%', waterSupply: 'Off', fanStatus: 'On', reading: '22:30, July 13' },
        // Add more nodes as needed
    ];

    // Update DOM with sample data (for demonstration purposes)
    nodes.forEach((node, index) => {
        const nodeElement = document.querySelector(`#temp${String.fromCharCode(65 + index)}`);
        if (nodeElement) {
            nodeElement.textContent = node.temperature;
        }

        const humidityElement = document.querySelector(`#humidity${String.fromCharCode(65 + index)}`);
        if (humidityElement) {
            humidityElement.textContent = node.humidity;
        }

        const soilElement = document.querySelector(`#soil${String.fromCharCode(65 + index)}`);
        if (soilElement) {
            soilElement.textContent = node.soilMoisture;
        }

        const waterElement = document.querySelector(`#water${String.fromCharCode(65 + index)}`);
        if (waterElement) {
            waterElement.textContent = node.waterSupply;
        }

        const fanElement = document.querySelector(`#fan${String.fromCharCode(65 + index)}`);
        if (fanElement) {
            fanElement.textContent = node.fanStatus;
        }

        const readingElement = document.querySelector(`#reading${String.fromCharCode(65 + index)}`);
        if (readingElement) {
            readingElement.textContent = node.reading;
        }
    });

    // Sample data for average readings (for demonstration purposes)
    const averageReadings = {
        temperature: '22.3°C',
        humidity: '55.3%',
        soilMoisture: '39.5%',
        waterSupply: 'On',
        fanStatus: 'Off'
    };

    // Update DOM with sample average readings
    document.getElementById('avg-temp').textContent = averageReadings.temperature;
    document.getElementById('avg-humidity').textContent = averageReadings.humidity;
    document.getElementById('avg-soil').textContent = averageReadings.soilMoisture;
    document.getElementById('water-supply-status').textContent = averageReadings.waterSupply;
    document.getElementById('fan-status').textContent = averageReadings.fanStatus;
});
