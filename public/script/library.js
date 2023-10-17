function toDate(returnDate) {
    const string = returnDate.split('.');
    const date = new Date(+string[2], +string[1] - 1, +string[0]);
    return date.getTime();
}

function updateLibraryPage(books) {
    let newTBody = '';
    books.forEach(book => {
        newTBody +=
            `<tr class="table_row">
                <td class="cell td-id">${book[1].id}</td>
                <td class="cell td_author">${book[1].author}</td>
                <td class="cell">${book[1].title}</td>
                <td class="cell">${book[1].releaseDate}</td>
                <td class="cell-icon">
                    <a href="/book/${book[1].id}" style="color: rgb(118, 54, 1)">
                        <i class="fa fa-book fa-2x" aria-hidden="true"></i>
                    </a>
                </td>
                <td class="cell ${book[1].have}">
                    ${book[1].have === "yes" ? 'Есть' : 'Отсутствует'}
                </td>
                <td class="cell ${toDate(book[1].returnDate) < Date.now() ? 'no' : ''}">
                    ${book[1].returnDate === "null" ? '---' : book[1].returnDate}
                </td>
                <td class="cell-icon">
                    <button class="delete" ${book[1].have === "no" ? 'disabled' : ''}>
                        <i class="fa fa-trash fa-2x" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>`
    });
    let tbody = document.getElementsByClassName('tbody');
    tbody[0].innerHTML = newTBody;
    deleteBook();
}

async function filter(filterType) {
    const url = '/?sort=' + filterType;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const filterBooks = await res.json();
            updateLibraryPage(filterBooks);
        }
    }
    catch (error) {
        console.log("Что-то пошло не так!");
        console.log(error);
    }
}

async function deleteBook() {
    const filterType = document.getElementById('filter_type');
    const deleteIcons = document.querySelectorAll(".delete");

    deleteIcons.forEach(function (deleteIcon) {
        deleteIcon.addEventListener('click', async event => {
            let target = event.target.closest(".delete");
            event.preventDefault();
            if (!confirm("Вы уверены, что хотите удалить этот элемент?")) {
                return;
            }
            const row = target.closest("tr");
            const id = row.cells[0].textContent;
            try {
                const res = await fetch(`/book/${id}`, {method: "DELETE"});
                if (res.ok) {
                    const booksWithDel = await res.json();
                    updateLibraryPage(booksWithDel);
                    await filter(filterType.value);
                }
            }
            catch(error) {
                console.log("Что-то пошло не так!");
                console.log(error);
            }
        })
    });
}

async function dialogAddBook() {
    const filterType = document.getElementById('filter_type');
    const openDialogButton = document.getElementById('addBookButton');
    const myDialog = document.getElementById('dialog');
    const form = document.querySelector('form');
    const closeDialogButton = document.getElementById('closeDialogButton');

    let saveChanges = true;

    openDialogButton.addEventListener('click', () => {
        myDialog.showModal();
        myDialog.style.display = 'flex';
    });

    form.addEventListener('change', event => {
        if (event.target.tagName === "INPUT") {
            saveChanges = false;
        }
    });

    closeDialogButton.addEventListener('click', event => {
        event.preventDefault();
        if (!saveChanges) {
            if (confirm("У вас остались несохраненные изменения. Все равно покинуть страницу?")) {
                window.location.href = '/';
            }
        } else {
            myDialog.close()
            myDialog.style.display = 'none';
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (saveChanges) {
            return;
        }
        const formData = new FormData(event.target);
        const newBook = Object.fromEntries(formData); //собираем данные
        saveChanges = true;
        try {
            const res = await fetch(window.location.href, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newBook)
            });
            if (res.ok) {
                const booksWithNew = await res.json();
                updateLibraryPage(booksWithNew);
                await filter(filterType.value);
                form.reset();
            }
        }
        catch(error) {
            console.log("Что-то пошло не так!");
            console.log(error);
        }
    })
}

deleteBook();
dialogAddBook();