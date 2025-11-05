const express = require("express");
const cors = require("cors");
require('dotenv').config();

// Import routes
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login.js");
const addpost = require("./routes/addpost.js");
const myposts = require("./routes/posts/myposts");
const allposts = require("./routes/posts/allposts");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use("/signup", signup);
app.use("/login", login);
app.use("/addpost", addpost);
app.use("/myposts", myposts);
app.use("/allposts", allposts);


const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});