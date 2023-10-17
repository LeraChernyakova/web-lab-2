const fs = require("fs");
function toDate(returnDate) {
    const string = returnDate.split('.');
    const date = new Date(+string[2], +string[1]-1, +string[0]);
    return date.getTime();
}

const sortReturnDate = (first, second) =>
    toDate(first[1].returnDate) - toDate(second[1].returnDate);

exports.dataFilter = function(booksDB, sort) {
    switch (sort) {
        case 'all':
            return booksDB;
        case 'have':
            return booksDB.filter(item => item[1].have.toLowerCase().trim() === "yes");
        case 'returnDate':
            return booksDB
                    .filter(item => item[1].have.toLowerCase().trim() === "no")
                    .sort(sortReturnDate);
    }
};

exports.generateID = function(storage) {
    const lastID = storage[storage.length - 1].id;
    const bookId = parseInt(lastID, 10) + 1
    return bookId.toString();
}

exports.findBookIndex = function (booksDB, id) {
    for (let i = 0; i < booksDB.length; i++) {
        if (booksDB[i].id === id)
            return i;
    }
    return -1;
}
exports.updateDB = function(data) {
    console.log('Обновление данных...');
    fs.writeFile('./dataBase.json', data, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Данные успешно обновлены!');
    });
};