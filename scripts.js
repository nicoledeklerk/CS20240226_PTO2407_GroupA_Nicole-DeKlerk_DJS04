import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { domEl } from './domElements.js';

const state = {
    page: 1,
    matches: books
};

// Function to set theme //
function setTheme(isNight) {
    document.documentElement.style.setProperty('--color-dark', isNight ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isNight ? '10, 10, 20' : '255, 255, 255');
}

// Initialize theme based on system preference //
function initTheme() {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    domEl.settingsTheme.value = prefersDark ? 'night' : 'day';
    setTheme(prefersDark);
}

// Creates an option element //
function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = text;
    return option;
}

// Populates dropdown menus //
function populateDropdown(element, items, defaultText) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createOption('any', defaultText));

    for (const [id, name] of Object.entries(items)) {
        fragment.appendChild(createOption(id, name));
    }

    element.appendChild(fragment);
}

// Creates a book preview button //
function createBookPreview({ author, id, image, title }) {
    const element = document.createElement('button');
    element.classList.add('preview');
    element.setAttribute('data-preview', id);
    element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;
    return element;
}

// Renders book previews //
function renderBooks(bookList) {
    const fragment = document.createDocumentFragment();
    for (const book of bookList) {
        fragment.appendChild(createBookPreview(book));
    }
    domEl.listItems.appendChild(fragment);
}

// Initializes the book list //
function initBookList() {
    renderBooks(state.matches.slice(0, BOOKS_PER_PAGE));
}

// Handles form submission and filtering //
function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    state.matches = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;

        return genreMatch && titleMatch && authorMatch;
    });

    state.page = 1;
    domEl.listItems.innerHTML = '';
    renderBooks(state.matches.slice(0, BOOKS_PER_PAGE));

    domEl.listMessage.classList.toggle('list__message_show', state.matches.length < 1);
}

// Loads more books on button click //
function loadMoreBooks() {
    const start = state.page * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    renderBooks(state.matches.slice(start, end));
    state.page += 1;
}

// Opens book details //
function showBookDetails(event) {
    const bookId = event.target.closest('.preview')?.dataset.preview;
    if (!bookId) return;

    const book = books.find(b => b.id === bookId);
    if (book) {
        domEl.listActive.open = true;
        domEl.listBlur.src = book.image;
        domEl.listImage.src = book.image;
        domEl.listTitle.innerText = book.title;
        domEl.listSubtitle.innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        domEl.listDescription.innerText = book.description;
    }
}

// Event Listeners //
function initEventListeners() {
    domEl.settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        setTheme(new FormData(event.target).get('theme') === 'night');
        domEl.settingsOverlay.open = false;
    });

    domEl.searchForm.addEventListener('submit', handleSearch);
    domEl.listButton.addEventListener('click', loadMoreBooks);
    domEl.listItems.addEventListener('click', showBookDetails);
    domEl.searchCancel.addEventListener('click', () => domEl.searchOverlay.open = false);
    domEl.settingsCancel.addEventListener('click', () => domEl.settingsOverlay.open = false);
    domEl.headerSearch.addEventListener('click', () => { domEl.searchOverlay.open = true; domEl.searchTitle.focus(); });
    domEl.headerSettings.addEventListener('click', () => { domEl.settingsOverlay.open = true; });
    domEl.listClose.addEventListener('click', () => { domEl.listActive.open = false; });
}

// Initialize Application //
function init() {
    initTheme();
    initBookList();
    populateDropdown(domEl.searchGenres, genres, 'All Genres');
    populateDropdown(domEl.searchAuthors, authors, 'All Authors');
    initEventListeners();
}

init();
