// login.js
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // Reference to the users in the database
        const usersRef = firebase.database().ref('user');

        // Get the user data
        usersRef.child('id1').get().then((snapshot) => {
            if (snapshot.exists()) {
                const storedUsername = snapshot.val();
                // If username matches, check password
                if (username === storedUsername) {
                    usersRef.child('password1').get().then((pwSnapshot) => {
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
