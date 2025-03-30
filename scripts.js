import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { domEl } from './domElements.js'

let page = 1;
let matches = books

function setTheme(isNight) {
    document.documentElement.style.setProperty('--color-dark', isNight ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isNight ? '10, 10, 20' : '255, 255, 255');
}

// Check and apply system theme preference
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
domEl.settingsTheme.value = prefersDark ? 'night' : 'day';
setTheme(prefersDark);

const starting = document.createDocumentFragment()

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    starting.appendChild(element)
}

domEl.listItems.appendChild(starting)

const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

domEl.searchGenres.appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

domEl.searchAuthors.appendChild(authorsHtml)

domEl.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

domEl.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

domEl.searchCancel.addEventListener('click', () => {
    domEl.searchOverlay.open = false
})

domEl.settingsCancel.addEventListener('click', () => {
    domEl.settingsOverlay.open = false
})

domEl.headerSearch.addEventListener('click', () => {
    domEl.searchOverlay.open = true 
    domEl.searchTitle.focus()
})

domEl.headerSettings.addEventListener('click', () => {
    domEl.settingsOverlay.open = true 
})

domEl.listClose.addEventListener('click', () => {
    domEl.listActive.open = false
})

// Event listener for theme change
domEl.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setTheme(new FormData(event.target).get('theme') === 'night');
    domEl.settingsOverlay.open = false;
})

domEl.searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        domEl.listMessage.classList.add('list__message_show')
    } else {
        domEl.listMessage.classList.remove('list__message_show')
    }

    domEl.listItems.innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    domEl.listItems.appendChild(newItems)
    domEl.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    domEl.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    domEl.searchOverlay.open = false
})

domEl.listButton.addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    domEl.listItems.appendChild(fragment)
    page += 1
})

domEl.listItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        domEl.listActive.open = true
        domEl.listBlur.src = active.image
        domEl.listImage.src = active.image
        domEl.listTitle.innerText = active.title
        domEl.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        domEl.listDescription.innerText = active.description
    }
})
