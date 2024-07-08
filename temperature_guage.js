

import { database, ref, onValue } from "./firebase-config.js";

// Reference to temperature in Firebase
const temperatureRef = ref(database, 'GreenHouse Raiwind/ESP1/temperature');

// Initialize JustGage for temperature
const temperatureGauge = new JustGage({
    id: "temperature-gauge",
    value: 0,
    min: 0,
    max: 50,
    title: "Temperature",
    label: "°C"
});

// Update temperature gauge with real-time data from Firebase
onValue(temperatureRef, (snapshot) => {
    temperatureGauge.refresh(snapshot.val());
});

