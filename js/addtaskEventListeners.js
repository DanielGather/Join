/**
 * Initializes event listeners for various user interactions once the DOM is fully loaded.
 * 
 * This function adds event listeners to specific input elements and form fields. These listeners are triggered
 * based on user actions such as key presses and input changes. The event listeners are initialized after the page content
 * has been completely loaded (i.e., when the `DOMContentLoaded` event is fired).
 * 
 * The following event listeners are initialized:
 * - Keydown event for subtask input field (`initializeEventListenerKeydownSubtaskInput`)
 * - Keydown event for title input field (`initializeEventListenerKeydownTitleInput`)
 * - Input event for title input field (`initializeEventListenerInputTitle`)
 * - Change event for date input field (`initializeEventListenerChangeDate`)
 * 
 * @returns {void} This function does not return any value but ensures that the relevant event listeners are set up.
 */
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListenerKeydownSubtaskInput();
    initializeEventListenerKeydownTitleInput();
    initializeEventListenerInputTitle();
    initializeEventListenerChangeDate();
});

/**
 * Initializes an event listener for the input field of the task title.
 * 
 * This function adds an event listener to the input field for the task title (`#addTaskTitle`). 
 * The event listener triggers the `checkIfCreateTaskButtonCanBeEnabled` function whenever the user 
 * types into the title input field, allowing the application to check if the "Create Task" button 
 * can be enabled or not based on the input.
 * 
 * The event listener listens for the 'input' event, which is fired every time the user changes the value 
 * of the input field.
 * 
 * @returns {void} This function does not return a value but ensures that the input event listener is set up.
 */
function initializeEventListenerInputTitle() {
    const addTaskTitle = document.getElementById('addTaskTitle');
    if (addTaskTitle) {
        addTaskTitle.addEventListener('input', checkIfCreateTaskButtonCanBeEnabled);
    }
}

/**
 * Initializes an event listener for the task due date input field.
 * 
 * This function adds an event listener to the input field for the task due date (`#inputDate`). 
 * The event listener triggers the `checkIfCreateTaskButtonCanBeEnabled` function whenever the user 
 * changes the value of the due date input field, allowing the application to check if the "Create Task" button 
 * can be enabled or not based on the selected due date.
 * 
 * The event listener listens for the 'change' event, which is fired when the user selects or modifies the value 
 * of the due date input field.
 * 
 * @returns {void} This function does not return a value but ensures that the change event listener is set up.
 */
function initializeEventListenerChangeDate() {
    const inputDate = document.getElementById('inputDate');
    if (inputDate) {
        inputDate.addEventListener('change', checkIfCreateTaskButtonCanBeEnabled);
    }
}

/**
 * Initializes an event listener for the 'keydown' event on the subtask input field.
 * 
 * This function adds an event listener to the subtask input field (`#subtasks-input`). 
 * The event listener listens for the 'keydown' event, and when the "Enter" key is pressed, 
 * it prevents the default behavior and triggers the `addSubTask` function to add the subtask.
 * 
 * The function ensures that pressing the "Enter" key inside the subtask input field submits 
 * the subtask without triggering a form submission or page refresh.
 * 
 * @returns {void} This function does not return a value but ensures that the keydown event listener is set up.
 */
function initializeEventListenerKeydownSubtaskInput() {
    const subtasksInput = document.getElementById('subtasks-input');
    if (subtasksInput) {
        subtasksInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addSubTask();
            }
        });
    }
}

/**
 * Initializes an event listener for the 'keydown' event on the task title input field.
 * 
 * This function adds an event listener to the task title input field (`#addTaskTitle`). 
 * The event listener listens for the 'keydown' event, and when the "Enter" key is pressed, 
 * it prevents the default behavior. This prevents the form from being submitted or the page 
 * from being refreshed when the user presses "Enter" while typing the task title.
 * 
 * @returns {void} This function does not return a value but ensures that the keydown event listener is set up.
 */
function initializeEventListenerKeydownTitleInput() {
    const addTaskTitle = document.getElementById('addTaskTitle');
    if (addTaskTitle) {
        addTaskTitle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
    }
}

/**
 * Adds an event listener for the 'click' event to handle closing the dropdown menu
 * when clicking outside of it.
 * 
 * Once the DOM content is fully loaded, this function attaches a 'click' event listener to
 * the document. The listener checks if a click occurs outside of the dropdown menu and its toggle 
 * button, and if so, it hides the dropdown menu and resets the toggle button image to its default state.
 * 
 * This behavior ensures that the dropdown menu closes when the user clicks anywhere outside of it,
 * providing a more intuitive and user-friendly interface.
 * 
 * @returns {void} This function does not return a value.
 */
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        let dropdownMenu = document.getElementById('dropDownMenu');
        let imgDropdownToggle = document.getElementById('imgDropdownToggle');
        let mainContainer = document.getElementById('main');
        let searchContactInput = document.getElementById('searchContact');
        if (dropdownMenu && imgDropdownToggle && mainContainer && searchContactInput) {
            if (!dropdownMenu.classList.contains('d-none')) {
                if (mainContainer.contains(event.target) && 
                    !dropdownMenu.contains(event.target) && 
                    !imgDropdownToggle.contains(event.target) &&
                    !searchContactInput.contains(event.target)
                ) {                    
                    dropdownMenu.classList.add('d-none');
                    imgDropdownToggle.src = './assets/img/arrow_drop_down.svg';
                }
            }
        }
    });
}); 

/**
 * This script listens for the `DOMContentLoaded` event and sets up event listeners to manage the visibility of
 * a category dropdown menu. It checks if specific elements (main container, category dropdown, category header,
 * and dropdown toggle image) exist on the page, and if so, attaches an event listener to the main container.
 * When a click event occurs outside the category dropdown or the category header, the dropdown is hidden and
 * the dropdown toggle image is updated to an arrow pointing down.
 *
 * @event DOMContentLoaded - This event is triggered when the initial HTML document has been completely loaded
 *                            and parsed, without waiting for stylesheets, images, and subframes to finish loading.
 *
 * The event listener added to the main container checks if the user clicked outside the category dropdown or
 * category header, and if so, hides the dropdown and updates the toggle image.
 *
 * @returns {void} - This function does not return anything. It sets up event listeners for DOM elements.
 *
 */
document.addEventListener('DOMContentLoaded', function () {
    const mainContainer = document.getElementById('main');
    const categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    const categoryHeaderContainer = document.querySelector('.category-header-container');
    const imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    if (mainContainer && categoryDropdownMenu && categoryHeaderContainer && imgCategoryDropdownToggle) {
        mainContainer.addEventListener('click', function (event) {
            if (
                !categoryHeaderContainer.contains(event.target) &&
                !categoryDropdownMenu.contains(event.target)
            ) {
                if (!categoryDropdownMenu.classList.contains('d-none')) {
                    categoryDropdownMenu.classList.add('d-none');
                    imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
                }
            }
        });
    }
});

/**
 * This script listens for the `DOMContentLoaded` event, and once triggered, it sets the minimum selectable date
 * in an input field of type "date". The minimum date is set to the current date, ensuring that users cannot 
 * select dates in the past. The script checks if the element with the ID `inputDate` exists before updating it.
 *
 * @event DOMContentLoaded - This event is fired when the HTML document has been completely loaded and parsed,
 *                            without waiting for stylesheets, images, or subframes to finish loading.
 *
 * The script retrieves the current date, formats it in the `YYYY-MM-DD` format, and sets it as the `min` 
 * attribute of the input field with the ID `inputDate`. This ensures that the user can only select the current 
 * date or any future date in the date input.
 *
 * @returns {void} - This function does not return anything. It performs DOM manipulation by setting the `min` 
 *                   attribute on the input field.
 *
 */
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    const dateInput = document.getElementById('inputDate');
    if (dateInput) { // checks, if element exists
        dateInput.setAttribute('min', minDate);
    }
});