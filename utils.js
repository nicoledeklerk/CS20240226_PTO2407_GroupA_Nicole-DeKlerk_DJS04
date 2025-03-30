// eventListeners.js
export function addEventListeners(domEl, books, authors, BOOKS_PER_PAGE) {
    domEl.searchCancel.addEventListener('click', () => {
        domEl.searchOverlay.open = false;
    });

    domEl.settingsCancel.addEventListener('click', () => {
        domEl.settingsOverlay.open = false;
    });

    domEl.headerSearch.addEventListener('click', () => {
        domEl.searchOverlay.open = true;
        domEl.searchTitle.focus();
    });

    domEl.headerSettings.addEventListener('click', () => {
        domEl.settingsOverlay.open = true;
    });

    domEl.listClose.addEventListener('click', () => {
        domEl.listActive.open = false;
    });

    // Event listener for theme change
    domEl.settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        setTheme(new FormData(event.target).get('theme') === 'night');
        domEl.settingsOverlay.open = false;
    });

    domEl.searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        const result = [];

        for (const book of books) {
            let genreMatch = filters.genre === 'any';

            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true; }
            }

            if (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
                (filters.author === 'any' || book.author === filters.author) && 
                genreMatch
            ) {
                result.push(book);
            }
        }

        // Handle the result here...
    });

    domEl.listButton.addEventListener('click', () => {
        // Handle show more button click...
    });

    domEl.listItems.addEventListener('click', (event) => {
        // Handle list item click...
    });
}
