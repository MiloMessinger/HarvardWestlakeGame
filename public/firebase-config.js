// Initialize Firebase - Replace these with your Firebase config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "hw-school-game.firebaseapp.com",
    projectId: "hw-school-game",
    storageBucket: "hw-school-game.firebasestorage.app",
    messagingSenderId: "551257158887",
    appId: "1:551257158887:web:b4070728c403dc4cd11e42"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
