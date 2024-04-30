const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Define a route to ensure the server is running
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
