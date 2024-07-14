import { database, ref, get, child } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // Reference to the users in the database
        const usersRef = ref(database, 'user');

        // Get the user data
        get(child(usersRef, 'id1')).then((snapshot) => {
            if (snapshot.exists()) {
                const storedUsername = snapshot.val();
                // If username matches, check password
                if (username === storedUsername) {
                    get(child(usersRef, 'password1')).then((pwSnapshot) => {
                        if (pwSnapshot.exists()) {
                            const storedPassword = pwSnapshot.val();
                            if (password === storedPassword) {
                                // Credentials are correct
                                sessionStorage.setItem('loggedIn', 'true');
                                window.location.href = 'bays.html';
                            } else {
                                errorMessage.textContent = 'Invalid username or password';
                            }
                        } else {
                            errorMessage.textContent = 'Error retrieving user data';
                        }
                    }).catch((error) => {
                        console.error(error);
                        errorMessage.textContent = 'Error checking credentials';
                    });
                } else {
                    errorMessage.textContent = 'Invalid username or password';
                }
            } else {
                errorMessage.textContent = 'User not found';
            }
        }).catch((error) => {
            console.error(error);
            errorMessage.textContent = 'Error checking credentials';
        });
    });
});
