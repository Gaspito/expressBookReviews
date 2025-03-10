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
    const sessionAuth = req.session.authorization;
    const {username} = sessionAuth;

    const isbn = req.params.isbn;

    const reviewBody = req.body.review.trim();

    if (!reviewBody)
        return res.status(404).json({message: "Cannot add an empty review"});

    const book = books[isbn];

    if (!book)
        return res.status(404).json({message: `Failed to find book with isbn ${isbn}`});

    const reviews = book.reviews;
    let message = "";
    if (!reviews[username])
        message = "Review added";
    else
        message = "Review updated";

    reviews[username] = reviewBody;

    return res.status(200).json({message});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const sessionAuth = req.session.authorization;
    const {username} = sessionAuth;

    const isbn = req.params.isbn;

    const book = books[isbn];

    if (!book)
        return res.status(404).json({message: `Failed to find book with isbn ${isbn}`});

    const reviews = book.reviews;
    if (!reviews[username])
        return res.status(404).json({message: "Cannot delete user review as there is no review from this user on this book"});

    delete reviews[username];

    return res.status(200).json({message: "Deleted user review"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
