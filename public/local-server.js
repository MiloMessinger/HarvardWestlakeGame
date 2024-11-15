const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// Replace Firebase config with environment variables
app.get('/js/config.js', (req, res) => {
    const config = `
        const firebaseConfig = {
            apiKey: "${process.env.FIREBASE_API_KEY}",
            authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
            databaseURL: "${process.env.FIREBASE_DATABASE_URL}",
            projectId: "${process.env.FIREBASE_PROJECT_ID}",
            storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
            messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
            appId: "${process.env.FIREBASE_APP_ID}"
        };
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
    `;
    res.type('application/javascript');
    res.send(config);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
