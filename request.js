import needle from "needle";
import fs from "fs";

const BASE_URL = "http://localhost:3000";
const FILE_PATH = "books.txt";

// list of books
const booksToAdd = [
    { bookName: "Harry Potter and the Philosopher’s Stone", isbn: "978-0-7475-3269-9", author: "J.K Rowling", yearPublished: "1997" },
    { bookName: "Harry Potter and the Chamber of Secrets", author: "J.K Rowling", yearPublished: "1998" },
    { bookName: "The Little Prince", isbn: "978-0156012195", author: "Antoine Saint-Exupery", yearPublished: "1943" }
];

// function to add a book to the server
const addBook = (book) => {
    needle.post(`${BASE_URL}/add-book`, book, { json: true }, (_, res) => {
        console.log(`${res.body}`);
    });
};

// ensure books are added only if they are missing to avoid duplicate
const existingBooks = fs.existsSync(FILE_PATH) ? fs.readFileSync(FILE_PATH, "utf8").split("\n") : [];
booksToAdd.forEach(book => {
    if (!existingBooks.some(line => line.includes(book.isbn))) { 
        addBook(book);
    }
});