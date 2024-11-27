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