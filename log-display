
//

import { database, ref, get, query, orderByKey, limitToLast } from "./firebase-config.js";

const LOG_DISPLAY_LIMIT = 100; // Number of log entries to display

function displayLogs(type) {
    const logsRef = ref(database, `bay 1/node 1/logs/${type}`);
    const recentLogsQuery = query(logsRef, orderByKey(), limitToLast(LOG_DISPLAY_LIMIT));
    
    get(recentLogsQuery).then((snapshot) => {
        if (snapshot.exists()) {
            const logs = snapshot.val();
            const logContainer = document.getElementById(`${type}-log`);
            logContainer.innerHTML = '';
            
            Object.entries(logs).forEach(([timestamp, data]) => {
                const date = new Date(parseInt(timestamp));
                const logEntry = document.createElement('p');
                logEntry.textContent = `${date.toLocaleString()}: ${data.value}`;
                logContainer.appendChild(logEntry);
            });
        } else {
            console.log(`No logs found for ${type}`);
        }
    }).catch((error) => {
        console.error(`Error fetching logs for ${type}:`, error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayLogs('temperature');
    displayLogs('soil_moisture');
    displayLogs('humidity');
});
