 
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAmVSOm8g6p4F3ZY4jxIEUTQH_oFllo1hg",
    authDomain: "greenhouse-raiwind.firebaseapp.com",
    databaseURL: "https://greenhouse-raiwind-default-rtdb.firebaseio.com",
    projectId: "greenhouse-raiwind",
    storageBucket: "greenhouse-raiwind.appspot.com",
    messagingSenderId: "338760023791",
    appId: "1:338760023791:web:667a022e8b69459eb2651a",
    measurementId: "G-CPD0XFLYN5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
