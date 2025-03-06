import express from "express";
import fs from "fs";

const app = express();
const FILE_PATH = "books.txt";

app.use(express.json());

// create empty file of books.txt does not exist
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "");
}

// add books
app.post("/add-book", (req, res) => {
    // get book details from the request
    const { bookName, isbn, author, yearPublished } = req.body;

    // check if all needed elements are provided
    if (!bookName || !isbn || !author || !yearPublished) {
        res.send('{ success: false}'); // send false if something is missing
        return;
    }

    // add the book to the file
    fs.appendFileSync(FILE_PATH, `${bookName},${isbn},${author},${yearPublished}\n`);
    res.send('{ success: true}'); // send success response
});

// find books by ISBN and author
app.get("/find-by-isbn-author", (req, res) => {
    let { isbn, author } = req.query; // get the isbn and author

    //check if something is missing
    if (!isbn || !author) {
        return res.send("");
    }

    // read the file contents, split into lines
    const books = fs.readFileSync(FILE_PATH, "utf8").split("\n");

    // store matching books
    let foundBooks = [];

    // loop through each line manually
    for (let i = 0; i < books.length; i++) {
        let line = books[i].trim();
        if (line === "") continue; // skip empty lines

        const [bookName, bookIsbn, bookAuthor, year] = line.split(",");

        if (bookIsbn === isbn && bookAuthor === author) {
            foundBooks.push(line);
        }
    }

    res.send(foundBooks);
});

// find books by author
app.get("/find-by-author", (req, res) => {
    let { author } = req.query; // get author

    //check if author is missing
    if (!author) {
        return res.send("");
    }

    // read the file and split into lines
    const books = fs.readFileSync(FILE_PATH, "utf8").split("\n");

    // store matching books
    let foundBooks = [];

    // loop through each line manually
    for (let i = 0; i < books.length; i++) {
        let line = books[i].trim();
        if (line === "") continue; // skip empty lines

        const bookDetails = line.split(",");
        const bookAuthor = bookDetails[2];

        if (bookAuthor === author) {
            foundBooks.push(line);
        }
    }

    res.send(foundBooks);
});

app.listen(3000, () => console.log(`Server started at port 3000`));