require('dotenv').config(); 
const express = require("express");
const cors = require("cors");

// Import routes
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login.js");
const addpost = require("./routes/addpost.js");
const myposts = require("./routes/posts/myposts");
const allposts = require("./routes/posts/allposts");
const addreply = require("./routes/addreply.js");
const postreplies = require("./routes/posts/postreplies");
const toggleupvote = require("./routes/upvote.js"); // <-- 1. IMPORT

const app = express();

// ... (middleware) ...
app.use(cors());
app.use(express.json());

// ... (root route) ...
app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use("/signup", signup);
app.use("/login", login);
app.use("/addpost", addpost);
app.use("/myposts", myposts);
app.use("/allposts", allposts);
app.use("/addreply", addreply);
app.use("/postreplies", postreplies);
app.use("/toggleupvote", toggleupvote); // <-- 2. USE THE ROUTE

const PORT =3000;
// ... (listen) ...
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});