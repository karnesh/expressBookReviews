const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    res.json(books);
  } catch {
    console.error(error);
    res.status(500).json({message: " Error retrieving book list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try{
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
      res.json(book)
    } else{
      res.status(404).json({message: "book not found"});
    }
  }catch {
    console.error(error);
    res.status(500).json({message: "Error retrieving book details based on ISBN"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try{
    const author = req.params.author;
    const booklist = [];

    const bookKeys = Object.keys(books);

    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === author) {
        booklist.push(book);
      }
    }

    if (booklist.length > 0) {
      res.json(booklist); // Send matching books as a JSON response
    } else {
      res.status(404).json({ message: "No books found by that author" }); // Handle no books found
    }
  }catch{
    console.error(error);
    res.status(500).json({message: "Error getting book details based on author"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try{
    const title = req.params.title;
    const booklist = [];

    const bookKeys = Object.keys(books);

    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title === title) {
        booklist.push(book);
      }
    }

    if (booklist.length > 0) {
      res.json(booklist); // Send matching books as a JSON response
    } else {
      res.status(404).json({ message: "No books found by that title" }); // Handle no books found
    }
  }catch{
    console.error(error);
    res.status(500).json({message: "Error getting book details based on title"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try{
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
      res.json(book.reviews);
    } else{
      res.status(404).json({message: "book not found"});
    }
  }catch{
    console.error(error);
    res.status(500).json({message: "Error getting book review based on isbn"})
  }
});

// Function to fetch book list using Promise callbacks
function getBookListWithPromise(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// Function to fetch book list using async-await
async function getBookListAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error; // Re-throw the error for handling in the route
  }
}

// Book list With Promise
public_users.get('/promise', function (req, res) {
  try {
    getBookListWithPromise('http://localhost:3000/') 
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

// Book list With Async
public_users.get('/async', async function (req, res) {
  try {
    const bookList = await getBookListAsync('http://localhost:3000/'); //
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});



module.exports.general = public_users;
