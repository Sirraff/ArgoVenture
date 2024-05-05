const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT = 3000;

// Database Connection Setup
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

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

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
        // Render index.ejs with the fetched projects
        res.render('index', { projects: projects });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
