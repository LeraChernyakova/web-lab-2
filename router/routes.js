const express = require("express");
const router = express.Router();
const { dataFilter, updateDB, findBookIndex, generateID} = require("./routesFunction")

router.get('/', (req, res) => {
    const storage = require("../dataBase.json");
    if (req.headers['sec-fetch-mode'] === 'cors') {
        console.log("Фильтрация данных...");
        let booksDB = Object.entries(storage);
        booksDB = dataFilter(booksDB, req.query.sort);
        res.json(booksDB);
    }
    else {
        res.render('library', {books: storage});
    }
});

router.post('/', (req, res) => {
    console.log("Добавление книги...");
    const storage = require("../dataBase.json");
    const newBookID = generateID(storage);
    const book = {
        id: newBookID,
        ...req.body,
        have: "yes",
        reader: "null",
        returnDate: "null"
    }
    storage.push(book);
    updateDB(JSON.stringify(storage));
    let booksDB = Object.entries(storage);
    res.json(booksDB);
    console.log('Книга успешно добавлена!');
})

router.delete('/', (req, res) => {
    console.log('Начало удаления...');
    const bookID = req.query.value;
    const storage = require("../dataBase.json");
    const bookIndex = findBookIndex(storage, bookID);
    storage.splice(bookIndex, 1);
    updateDB(JSON.stringify(storage));
    let booksDB = Object.entries(storage);
    res.json(booksDB);
    console.log('Книга успешно удалена!');
});

router.get('/book/:id', (req, res) => {
    console.log("Открытие книги.");
    const bookID = req.params.id;
    const storage = require("../dataBase.json");
    const bookIndex = findBookIndex(storage, bookID);
    res.charset = 'utf-8';
    res.render('book', {book: storage[bookIndex]});
})

router.delete('/book/:id', (req, res)=>{
    res.redirect(`/?value=${req.params.id}`);
});

router.post('/book/:id', (req, res) => {
    console.log("Сохранение изменений...");
    const storage = require("../dataBase.json");
    const bookID = req.params.id;
    const bookIndex = findBookIndex(storage, bookID);
    const book = {
        id: req.params.id,
        ...req.body,
    }
    if (book.have === 'Есть') {
        book.have = "yes";
    }
    else {
        book.have = "no";
    }
    if (book.reader === '') {
        book.reader = "null";
    }
    if (book.returnDate === '') {
        book.returnDate = "null";
    }
    storage[bookIndex] = book;
    updateDB(JSON.stringify(storage));
    res.render('book', {book: storage[bookIndex]});
})

module.exports = router;