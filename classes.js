export class SearchForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);

        this.dispatchEvent(new CustomEvent('search-submit', {
            detail: filters,
            bubbles: true,
            composed: true
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 1rem;
                    background: rgba(var(--color-light), 1);
                    color: rgba(var(--color-dark), 0.9);
                    border-radius: 8px;
                    border: 1px solid rgba(var(--color-dark), 0.1);
                }
                input, select {
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: 1px solid rgba(var(--color-dark), 0.2);
                    border-radius: 6px;
                    background-color: rgba(var(--color-light), 1);
                    color: rgba(var(--color-dark), 1);
                    font-family: inherit;
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: rgba(var(--color-blue), 1);
                    box-shadow: 0 0 0 2px rgba(var(--color-blue), 0.2);
                }

                button {
                    margin-top: 0.5rem;
                    padding: 0.75rem;
                    background-color: rgba(var(--color-blue), 1);
                    color: rgba(var(--color-force-light), 1);
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-family: inherit;
                    transition: background-color 0.2s;
                }

                button:hover {
                    background-color: rgba(var(--color-blue), 0.8);
                }
            </style>
            <form>
                <input name="title" type="text" placeholder="Search by Title">
                <select name="genre">
                    <option value="any">All Genres</option>
                </select>
                <select name="author">
                    <option value="any">All Authors</option>
                </select>
                <button type="submit">Search</button>
            </form>
        `;
    }

    setGenres(genres) {
        const select = this.shadowRoot.querySelector('select[name="genre"]');
        for (const [id, name] of Object.entries(genres)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            select.appendChild(option);
        }
    }

    setAuthors(authors) {
        const select = this.shadowRoot.querySelector('select[name="author"]');
        for (const [id, name] of Object.entries(authors)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            select.appendChild(option);
        }
    }
}

customElements.define('search-form', SearchForm);
