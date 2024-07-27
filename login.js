// login.js
import { database, ref, get } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        console.log('Form submitted');
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Attempting login for username:', username);

        // Reference to the users in the database
        const usersRef = ref(database, 'users');

        // Check if the entered username exists in the database
        get(usersRef).then((snapshot) => {
            console.log('Database snapshot received');
            if (snapshot.exists()) {
                const users = snapshot.val();
                console.log('Users data:', users);
                if (users[username]) {
                    const storedPassword = users[username].password;
                    if (password === storedPassword) {
                        console.log('Login successful');
                        // Credentials are correct
                        sessionStorage.setItem('loggedIn', 'true');
                        window.location.href = 'bays.html'; // Redirect to bays.html on successful login
                    } else {
                        console.log('Invalid password');
                        showError('Invalid username or password');
                    }
                } else {
                    console.log('Username not found');
                    showError('Invalid username or password');
                }
            } else {
                console.log('No users found in database');
                showError('An error occurred. Please try again.');
            }
        }).catch((error) => {
            console.error('Database error:', error);
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
