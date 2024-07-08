document.addEventListener('DOMContentLoaded', () => {
    const waterPumpSlider = document.getElementById('water-pump-slider');
    const waterPumpDropdown = document.getElementById('water-pump-dropdown');
    const fansSlider = document.getElementById('fans-slider');
    const fansDropdown = document.getElementById('fans-dropdown');

    waterPumpSlider.addEventListener('input', () => {
        if (waterPumpSlider.value == 1) {
            waterPumpDropdown.style.display = 'block';
        } else {
            waterPumpDropdown.style.display = 'none';
        }
    });

    fansSlider.addEventListener('input', () => {
        if (fansSlider.value == 1) {
            fansDropdown.style.display = 'block';
        } else {
            fansDropdown.style.display = 'none';
        }
    });
});
