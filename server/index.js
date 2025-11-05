const express = require("express");
const cors = require("cors");

// Import routes
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login.js");

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Use routes
app.use("/signup", signup);
app.use("/login", login);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});