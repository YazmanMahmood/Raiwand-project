// Import Firebase app and authentication modules
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase-config.js"; // Adjust the path as necessary

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Sign in with Firebase Authentication
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                sessionStorage.setItem('loggedIn', 'true');
                // Redirect to bays.html or desired page
                window.location.href = 'bays.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessageText = error.message;
                errorMessage.textContent = errorMessageText;
            });
    });
});
