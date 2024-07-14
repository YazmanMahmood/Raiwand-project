document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Sign in with Firebase Authentication
        firebase.auth().signInWithEmailAndPassword(username, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                sessionStorage.setItem('loggedIn', 'true');
                // Redirect to bays.html
                window.location.href = 'bays.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                errorMessage.textContent = errorMessage;
            });
    });
});
