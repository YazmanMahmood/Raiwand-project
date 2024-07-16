document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // Reference to the users in the database
        const usersRef = firebase.database().ref('user');

        // Get the user data
        usersRef.child('id1').once('value').then((snapshot) => {
            const storedUsername = snapshot.val();
            if (username === storedUsername) {
                usersRef.child('password1').once('value').then((pwSnapshot) => {
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
        }).catch((error) => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
        });
    });
});
