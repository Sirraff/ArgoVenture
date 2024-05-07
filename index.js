const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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
    const selectedCategory = req.query.category || "";
    const sortOrder = req.query.sort || 'likes';
    const orderDirection = req.query.order || 'DESC';
    const limit = req.query.limit || 25;

    let sql = `
        SELECT p.project_id, p.project_name, p.project_description, p.likes, c.category_name
        FROM Projects p
        LEFT JOIN Categories c ON p.category_id = c.category_id
    `;

    if (selectedCategory) {
        sql += ` WHERE c.category_name = '${selectedCategory}'`;
    }

    sql += ` ORDER BY p.${mysql.escapeId(sortOrder)} ${orderDirection} LIMIT ${parseInt(limit)}`;

    const fetchCategories = "SELECT category_id, category_name FROM Categories;";

    db.query(fetchCategories, (error, categories) => {
        if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).send('Error fetching categories');
        }

        db.query(sql, (error, projects) => {
            if (error) {
                console.error('Error fetching projects:', error);
                return res.status(500).send('Error fetching projects');
            }
            const isAuthenticated = req.session.user !== undefined;
            res.render('index', {
                projects,
                categories,
                selectedCategory,
                sort: req.query.sort,
                order: req.query.order,
                isAuthenticated
            });
        });
    });
});






app.get('/add-update-project', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    // Fetch categories to fill the dropdown
    const sql = "SELECT category_id, category_name FROM Categories";
    db.query(sql, (error, categories) => {
        if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).send('Error fetching categories');
        }
        res.render('add-update-project', {
            title: 'Add or Update Project',
            user: req.session.user, // Optional: Pass user details to the view if needed
            categories: categories // Pass categories to the view for the dropdown
        });
    });
});

app.get('/user-projects', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/');
    }

    const sql = "SELECT * FROM Projects WHERE creator_id = ?";
    db.query(sql, [req.session.user.uid], (error, projects) => {
        if (error) {
            console.error('Error fetching user projects:', error);
            return res.status(500).send('Failed to retrieve projects');
        }
        res.render('user-projects', { projects: projects });
    });
});

// Route to fetch project details for editing
app.get('/projects/edit/:id', (req, res) => {
    const sql = "SELECT * FROM Projects WHERE project_id = ?";
    db.query(sql, [req.params.id], (error, results) => {
        if (error) {
            return res.status(500).send('Failed to fetch project details');
        }
        res.render('edit-project', { project: results[0] });
    });
});

// to update the project cards from user
app.get('/projects/edit/:id', (req, res) => {
    const sql = "SELECT * FROM Projects WHERE project_id = ?";
    db.query(sql, [req.params.id], (error, results) => {
        if (error) {
            return res.status(500).send('Failed to fetch project details');
        }
        if (results.length > 0) {
            res.render('edit-project', { project: results[0] });
        } else {
            res.status(404).send('Project not found');
        }
    });
});

app.post('/add-project', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/');
    }

    const { projectName, projectDescription, githubRepo, projectCategory } = req.body;
    const sql = "INSERT INTO Projects (project_name, project_description, github_repo, category_id, creator_id) VALUES (?, ?, ?, ?, ?)";
    const values = [projectName, projectDescription, githubRepo || null, projectCategory, req.session.user.uid];

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error adding project:', error);
            return res.status(500).send('Failed to add project');
        }
        res.redirect('/user-projects'); // Redirect to the user's projects page
    });
});


app.post('/toggle-like/:projectId', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'You must be logged in to like projects.' });
    }
    const projectId = req.params.projectId;
    const userId = req.session.user.uid;

    const likeCheckSql = "SELECT * FROM Likes WHERE project_id = ? AND user_id = ?";
    db.query(likeCheckSql, [projectId, userId], (error, results) => {
        if (error) {
            console.error('Error checking likes:', error);
            return res.status(500).json({ success: false, message: 'Failed to process like.' });
        }

        if (results.length > 0) {
            const deleteLikeSql = "DELETE FROM Likes WHERE project_id = ? AND user_id = ?";
            db.query(deleteLikeSql, [projectId, userId], (error) => {
                if (error) {
                    console.error('Error deleting like:', error);
                    return res.status(500).json({ success: false, message: 'Failed to unlike the project.' });
                }
                res.json({ success: true, liked: false });
            });
        } else {
            const insertLikeSql = "INSERT INTO Likes (project_id, user_id) VALUES (?, ?)";
            db.query(insertLikeSql, [projectId, userId], (error) => {
                if (error) {
                    console.error('Error inserting like:', error);
                    return res.status(500).json({ success: false, message: 'Failed to like the project.' });
                }
                res.json({ success: true, liked: true });
            });
        }
    });
});

// Route to handle project updates
app.post('/projects/edit/:id', (req, res) => {
    const { projectName, projectDescription, participants } = req.body;
    const sql = "UPDATE Projects SET project_name = ?, project_description = ?, participants = ? WHERE project_id = ?";
    db.query(sql, [projectName, projectDescription, participants, req.params.id], (error, results) => {
        if (error) {
            return res.status(500).send('Failed to update project');
        }
        res.redirect('/user-projects');
    });
});

// Route to delete a project
app.delete('/projects/delete/:id', (req, res) => {
    const sql = "DELETE FROM Projects WHERE project_id = ?";
    db.query(sql, [req.params.id], (error, results) => {
        if (error) {
            return res.json({ success: false, message: 'Failed to delete project' });
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    });
});

app.post('/add-project', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/');
    }

    const { projectName, projectDescription, githubRepo, projectCategory } = req.body;
    const sql = `INSERT INTO Projects (project_name, project_description, github_repo, category, creator_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [projectName, projectDescription, githubRepo || null, projectCategory, req.session.user.uid];

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error adding project:', error);
            return res.status(500).send('Failed to add project');
        }
        res.redirect('/'); // Redirect to the project list or confirmation page
    });
});
    

app.post('/sessionLogin', (req, res) => {
    const idToken = req.body.idToken;
    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            const userId = decodedIdToken.uid;
            const userName = decodedIdToken.name || "No name provided";

            // Fetch or create a user in the Users table
            const userCheckSql = "SELECT user_id FROM Users WHERE google_id = ?";
            db.query(userCheckSql, [userId], (err, results) => {
                if (err) {
                    console.error('Database error on user check:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (results.length === 0) {
                    // No user found, insert new user
                    const insertUserSql = "INSERT INTO Users (name, google_id) VALUES (?, ?)";
                    db.query(insertUserSql, [userName, userId], (err, insertResult) => {
                        if (err) {
                            console.error('Error adding user:', err);
                            return res.status(500).json({ error: 'Failed to create user' });
                        }
                        const newUser = insertResult.insertId;
                        req.session.user = { uid: newUser, name: userName };
                        res.json({ status: 'success', message: 'User added and session established.' });
                    });
                } else {
                    // User exists, set the session
                    const existingUser = results[0].user_id;
                    req.session.user = { uid: existingUser, name: userName };
                    res.json({ status: 'success', message: 'Session established.' });
                }
            });
        }).catch((error) => {
            console.error('Failed to verify ID token:', error);
            res.status(401).json({ status: 'failure', message: 'Authentication failed.' });
        });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// route for meet the team
app.get('/team', (req, res) => {
    res.render('team');
});

// Features route
app.get('/features', (req, res) => {
    res.render('features');
});

// Feedback page route
app.get('/feedback', (req, res) => {
    res.render('feedback');  
});

app.post('/submit-feedback', (req, res) => {
    const { satisfaction, comments } = req.body;
    
    let sql = 'INSERT INTO Feedback (satisfaction, comments) VALUES (?, ?)';
    db.query(sql, [satisfaction, comments], (err, result) => {
        if (err) {
            console.error('Error saving feedback:', err);
            res.send('<script>alert("Error submitting feedback. Please try again later."); window.location.href="/feedback";</script>');
            return;
        }
        res.send('<script>alert("Thank you for your feedback!"); window.location.href="/";</script>');
    });
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
