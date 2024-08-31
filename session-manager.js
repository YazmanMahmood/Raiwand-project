// session-manager.js
const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
let timeoutId;

function resetTimeout() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(logout, TIMEOUT_DURATION);
}

function startSessionTimer() {
    resetTimeout();
    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keypress', resetTimeout);
}

function stopSessionTimer() {
    clearTimeout(timeoutId);
    document.removeEventListener('mousemove', resetTimeout);
    document.removeEventListener('keypress', resetTimeout);
}

function logout() {
    sessionStorage.removeItem('loggedIn');
    stopSessionTimer();
    alert('Your session has expired. Please log in again.');
    window.location.href = 'login.html';
}

export { startSessionTimer, stopSessionTimer };
