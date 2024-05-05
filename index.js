const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = 3000;

// Firebase admin initialization
const serviceAccount = require('./config/argoventure-afa36-firebase-adminsdk-5o0ok-45ac3f7f3d.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://argoventure-afa36.firebaseio.com"
});

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false, // change to false to prevent saving session for unlogged users
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function dbConnection() {
    return mysql.createPool({
        connectionLimit: 10,
        host: "k2pdcy98kpcsweia.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "cdu3qtcqxby6v80e",
        password: "fhwrinefqqqqmkxa",
        database: "fg6gmfahdnrnu7dh",
    });
}

const db = dbConnection();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const sql = `
        SELECT project_id, project_name, project_description, likes
        FROM Projects
        ORDER BY likes DESC
        LIMIT 10;
    `;
    db.query(sql, (error, projects) => {
        if (error) {
            console.error('Error fetching projects:', error);
            return res.status(500).send('Error fetching projects');
        }
        const isAuthenticated = req.session.user !== undefined;
        res.render('index', { projects: projects, authenticated: isAuthenticated });
    });
});
app.get('/add-update-project', (req, res) => {
    // Check if the user is authenticated
    if (req.session && req.session.user) {
        // If authenticated, render the add-update-project page
        res.render('add-update-project', {
            title: 'Add or Update Project',
            user: req.session.user  // Optional: Pass user details to the view if needed
        });
    } else {
        // If not authenticated, redirect to login page or homepage
        res.redirect('/login');  // Adjust as necessary to point to your login route or homepage
    }
});

app.post('/sessionLogin', (req, res) => {
    const idToken = req.body.idToken;
    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            req.session.user = decodedIdToken;
            res.json({ status: 'success' });
        }).catch((error) => {
            console.error('Failed to verify ID token:', error);
            res.status(401).json({ status: 'failure' });
        });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
