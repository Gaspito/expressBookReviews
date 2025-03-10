const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validUsers = users.filter(u => {
        return u.username === username;
    });
    return validUsers >= 1;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter(u => {
        return u.username === username && u.password === password;
    });
    return validUsers >= 1;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) 
        return res.status(404).json({message: "Missing login username or password."});

    if (authenticatedUser(username, password))
        return res.status(208).json({message: "Could not log in: invalid username or password."});

    let accessToken = jwt.sign({
        data: password,
    }, "access", {expiresIn: 60 * 60 * 3});

    req.session.authorization = {accessToken, username};

    return res.status(200).json({message: "Log in successful"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
