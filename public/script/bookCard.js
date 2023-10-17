async function bookCard() {
    const comebackButton = document.getElementById("comeback");
    const form = document.getElementById("bookForm");
    const haveInput = form.querySelector("[name='have']");
    const returnDateInput = form.querySelector("[name='returnDate']");
    const readerInput = form.querySelector("[name='reader']");
    const returnBookButton = document.getElementById('returnBook');
    const getBookButton = document.getElementById('getBook');
    const cancelButton = document.getElementById('cancel');

    const dialog = document.getElementById('dialogAdd');
    const dialogForm = dialog.querySelector('.book-form')
    const closeDialogButton = document.getElementById('closeDialogButton');

    let bookInformation = Object.fromEntries(new FormData(form));
    let saveChanges = true;

    let saveReaderChanges = true;

    comebackButton.addEventListener('click', event => {
        event.preventDefault();
        if(!saveChanges){
            if(confirm("У вас остались несохраненные изменения. Все равно покинуть страницу?"))
                window.location.href = '/';
        } else
            window.location.href = '/';
    });

    returnBookButton.addEventListener('click', event => {
        event.preventDefault();
        haveInput.value = "Есть";
        readerInput.value = "";
        returnDateInput.value = "";
        getBookButton.style.display = "block";
        returnBookButton.style.display = "none";
        saveChanges = false;
    });

    form.addEventListener('change', event => {
        if(event.target.tagName === "INPUT"){
            saveChanges = false;
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (saveChanges){
            return;
        }
        const formData = new FormData(event.target);
        bookInformation = Object.fromEntries(formData);
        saveChanges = true;
        await fetch(window.location.href, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(bookInformation)
        });
        document.title = form.querySelector("[name='title']").value;
        document.querySelector('.title').textContent = form.querySelector("[name='title']").value;
    });

    cancelButton.addEventListener('click', event => {
        event.preventDefault();
        form.querySelectorAll("input").forEach(item => {
            item.value = bookInformation[item.name];
        });
        saveChanges = true;
    });

    //выдача книги
    getBookButton.addEventListener('click', () => {
        dialog.showModal();
        dialog.style.display = 'flex';
    });

    closeDialogButton.addEventListener('click', event => {
        event.preventDefault();
        if(!saveReaderChanges){
            if(confirm("У вас остались несохраненные изменения. Все равно покинуть страницу?")) {
                dialog.style.display = 'none';
                dialog.close();
            }
        }
        else {
            dialog.style.display = 'none';
            dialog.close();
        }
    });

    dialogForm.addEventListener('change', event => {
        if(event.target.tagName === "INPUT"){
            saveReaderChanges = false;
        }
    });

    dialogForm.addEventListener('submit',event => {
        event.preventDefault();
        haveInput.value = "Отсутсвует";
        readerInput.value = dialogForm.querySelector("[name='reader']").value;
        returnDateInput.value = dialogForm.querySelector("[name='returnDate']").value;
        returnBookButton.style.display = "inline";
        getBookButton.disable = true;
        getBookButton.style.display = "none";
        saveReaderChanges = true;
        saveChanges = false;
        dialogForm.reset();
    })
}

bookCard();