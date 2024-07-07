
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        if (username === 'admin' && password === 'yazman') {
            // Save login state
            sessionStorage.setItem('loggedIn', 'true');
            // Redirect to main page (index.html)
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
    });
});