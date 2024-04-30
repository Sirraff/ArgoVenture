const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Render index.ejs with default user info
    res.render('index', { userName: '', userEmail: '' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
