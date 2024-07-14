document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('user1').value;
        const password = document.getElementById('password1').value;

        // Initialize Firebase app if not already initialized
        const firebaseConfig = {
            apiKey: "AIzaSyAmVSOm8g6p4F3ZY4jxIEUTQH_oFllo1hg",
            authDomain: "greenhouse-raiwind.firebaseapp.com",
            projectId: "greenhouse-raiwind"
            // Add other Firebase config parameters as needed
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Sign in with Firebase Authentication
        firebase.auth().signInWithEmailAndPassword(username, password)
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
