# DJS03 Project Brief: Book Connect - Abstractions

 #### Preesentation Link
 https://www.loom.com/share/afa5f59cf52f4d189d0320ecd483b159?sid=0a99c1d3-f011-426c-8a93-ad582c974e61

#### Written Report 

Our assignment for DJS03 is to analyse and refactor the JavaScript and HTML Started code provided, and apply abstraction to hide complexity. 

The very first thing that I noticed when looking at the starter code is that there was much repetition of code for creating similar elements and the code was unorganized and difficult to read.  Therefore I will be walking  you through the rationale behind the refactoring decisions in my JavaScript code.

I centralized all DOM elements in an external file to keep the script clean and separate UI references from logic. A **state object** now tracks pagination and filtered books, ensuring predictable updates.

UI logic was modularized into **reusable functions**:

- `setTheme` manages themes.
- `createOption` & `populateDropdown` handle dropdowns efficiently.
- `createBookPreview` and `renderBooks` manage book display, avoiding redundancy.

Filtering and pagination were streamlined:

- `handleSearch` applies filters and updates the list.
- `loadMoreBooks` handles pagination.

To improve readability, **all event listeners** were grouped in `initEventListeners`. Finally, `init` serves as the **main entry point**, setting up themes, dropdowns, and event listeners.

This structure ensures **modularity, reusability, and maintainability**, simplifying future updates.
