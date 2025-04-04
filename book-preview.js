

export class BookPreview extends HTMLElement {
    connectedCallback() {
      const author = this.getAttribute('author') || 'Unknown Author';
      const id = this.getAttribute('id');
      const image = this.getAttribute('image') || 'placeholder.jpg';
      const title = this.getAttribute('title') || 'Untitled';
  
      this.innerHTML = `
        <button class="preview" data-preview="${id}">
          <img class="preview__image" src="${image}" alt="Cover of ${title}"/>
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${author}</div>
          </div>
        </button>
      `;
    }
  }
  
  customElements.define('book-preview', BookPreview);
  