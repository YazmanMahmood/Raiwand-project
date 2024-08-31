// login.js
import { database, ref, get } from './firebase-config.js';
import { startSessionTimer } from './session-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Reference to the users in the database
        const usersRef = ref(database, 'users');

        // Check if the entered username exists in the database
        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                if (users[username]) {
                    const storedPassword = users[username].password;
                    if (password === storedPassword) {
                        // Credentials are correct
                        sessionStorage.setItem('loggedIn', 'true');
                        startSessionTimer(); // Start the session timer
                        window.location.href = 'bays.html'; // Redirect to bays.html on successful login
                    } else {
                        showError('Invalid username or password');
                    }
                } else {
                    showError('Invalid username or password');
                }
            } else {
                showError('An error occurred. Please try again.');
            }
        }).catch((error) => {
            console.error('Error:', error);
            showError('An error occurred. Please try again.');
        });
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.opacity = '1';
        setTimeout(() => {
            errorMessage.style.opacity = '0';
        }, 3000);
    }
});
