// Book class: represents a book
class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: handle ui tasks
class UI {
  static displayBooks(){
    // store the array on another variable
    const books = Store.getBooks();

    // loop for each book
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book){
    // selecting query with id book-list
    const list = document.querySelector('#book-list');

    // creating element tr and store it into row
    const row = document.createElement('tr');

    // add a new element into row with some data
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    // adding row to list on the document
    list.appendChild(row);
  }

  static deleteBook(el){
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// store class: handles storage
class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book){
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books))
  }
}

// events: display books
  // whenever document finish loading the dom will load UI.displayBooks
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// event: add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // preventing browser for submitting
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);

    // add book to ui
    UI.addBookToList(book);

    // add book to store
    Store.addBook(book);

    // show success message
    UI.showAlert('Book added', 'success');

    // Crear fields
    UI.clearFields();
  }
});

// event: remove a book
document.querySelector('#book-list').addEventListener('click', (e)=> {
  // remove book from ui
  UI.deleteBook(e.target);

  // remove book from the store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show remove message
  UI.showAlert('Book removed', 'success');
});
