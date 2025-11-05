// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Define a simple API route
app.get('/', (req, res) => {
  res.send('Hello from the Express Backend!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: 8000`);
});