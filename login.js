import { database, ref, onValue } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // Reference to the users in the database
        const usersRef = ref(database, 'user');

        // Get the user data
        onValue(ref(database, 'user/id1'), (snapshot) => {
            const storedUsername = snapshot.val();
            if (username === storedUsername) {
                onValue(ref(database, 'user/password1'), (pwSnapshot) => {
                    const storedPassword = pwSnapshot.val();
                    if (password === storedPassword) {
                        // Credentials are correct
                        sessionStorage.setItem('loggedIn', 'true');
                        window.location.href = 'bays.html';
                    } else {
                        errorMessage.textContent = 'Invalid username or password';
                    }
                });
            } else {
                errorMessage.textContent = 'Invalid username or password';
            }
        }, {
            onlyOnce: true
        });
    });
});
