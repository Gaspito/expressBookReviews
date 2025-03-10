const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password || username.includes(" ") || password.includes(" "))
        return res.status(404).json({message: "Missing or invalid username or password"});

    if (users.find(u => u.username === username))
        return res.status(404).json({message: "A user with the same name is already registered"});

    users.push({username, password});

    return res.status(200).json({message: "User registered"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const bookList = Object.keys(books).map(isbn => {
        const book = books[isbn];
        return {isbn, author: book.author, title: book.title};
    });
    return res.status(200).json({books: bookList});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book)
        return res.status(404).json({message: `There is no book with isbn '${isbn}'`});
    return res.status(200).json({isbn, author: book.author, title: book.title});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.keys(books).map(isbn => {
        const book = books[isbn];
        return {isbn, author: book.author, title: book.title};
    }).filter(book => book.author == author);
    return res.status(200).json({author, books: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const booksWithTitle = Object.keys(books).map(isbn => {
        const book = books[isbn];
        return {isbn, author: book.author, title: book.title};
    }).filter(book => book.title == title);
    return res.status(200).json({title, books: booksWithTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book)
        return res.status(404).json({message: `There is no book with isbn '${isbn}'`});
    const reviews = book.reviews;
    return res.status(200).json({isbn, reviews});
});

module.exports.general = public_users;
