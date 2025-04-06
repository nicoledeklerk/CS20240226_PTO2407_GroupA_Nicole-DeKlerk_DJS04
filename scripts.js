import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { domEl } from './domElements.js';
import './classes.js';
import './book-preview.js';


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


// Renders book previews //
function renderBooks(bookList) {
    const fragment = document.createDocumentFragment();

    for (const book of bookList) {
        const preview = document.createElement('book-preview');
        preview.setAttribute('id', book.id);
        preview.setAttribute('title', book.title);
        preview.setAttribute('author', authors[book.author]);
        preview.setAttribute('image', book.image);
        fragment.appendChild(preview);
    }
    domEl.listItems.appendChild(fragment);
}

// Initializes the book list //
function initBookList() {
    renderBooks(state.matches.slice(0, BOOKS_PER_PAGE));
    updateShowMoreButton(); // Check button visibility after initial load
}

// Handles form submission and filtering //
function handleSearch(event) {
    const filters = event.detail;  // { title, genre, author }

    // Apply filtering logic
    state.matches = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;

        return genreMatch && titleMatch && authorMatch;
    });

    // Reset page and render the filtered books
    state.page = 1;
    domEl.listItems.innerHTML = '';
    renderBooks(state.matches.slice(0, BOOKS_PER_PAGE));

    // Handle the "no results" message and update the "Show More" button visibility
    domEl.listMessage.classList.toggle('list__message_show', state.matches.length < 1);
    updateShowMoreButton(); // Update the button visibility after filtering
}

// Loads more books on button click //
function loadMoreBooks() {
    const start = state.page * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    renderBooks(state.matches.slice(start, end));
    state.page += 1;

    updateShowMoreButton(); // Update the "Show More" button visibility
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

// Updates the "Show More" button visibility
function updateShowMoreButton() {
    const hasMoreBooks = state.matches.length > state.page * BOOKS_PER_PAGE;

    domEl.listButton.style.display = hasMoreBooks ? 'block' : 'none';

    if (hasMoreBooks) {
        domEl.listButton.textContent = 'Show more';
    }
}

// Event Listeners //
function initEventListeners() {
    const searchForm = document.querySelector('search-form');  // Querying directly in main.js

    domEl.settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        setTheme(new FormData(event.target).get('theme') === 'night');
        domEl.settingsOverlay.open = false;
    });

    searchForm.addEventListener('search-submit', handleSearch);
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

    const searchForm = document.querySelector('search-form');  // Querying directly in main.js
    searchForm.setGenres(genres);
    searchForm.setAuthors(authors);
    initEventListeners();
}

init();
