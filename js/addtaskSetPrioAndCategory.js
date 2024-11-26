/**
 * Toggles the priority type for a task and updates the associated button's appearance.
 * 
 * This function checks if the provided priority type is the same as the currently selected one.
 * If it is, it resets the button's color and priority, effectively "unselecting" the priority. 
 * If it isn't, it sets the new priority and updates the button color to reflect the chosen priority.
 * 
 * The function also updates a global variable (`statusPriority`) to store the currently selected priority.
 * 
 * @param {string} priorityType - The priority type to be set. This can be one of the following: "urgent", "medium", "low".
 * @param {number} idVariable - The unique identifier for the task, used to target specific elements (buttons/images) associated with the task.
 * 
 * @returns {void} This function does not return a value, but it updates the global `statusPriority` and modifies the button styles.
 */
function chooseTaskPrioType(priorityType, idVariable) {
    if (statusPriority === priorityType) {
        setButtonColorForPrio(null, idVariable);
        statusPriority = null;
        return null;
    }
    statusPriority = priorityType;
    setButtonColorForPrio(priorityType, idVariable);
}

/**
 * Sets the color and icon for the priority buttons based on the given priority type.
 * 
 * This function first resets the styles of all priority buttons. Then, depending on the provided `priorityType`, 
 * it updates the background color, text color, and icon of the respective button. 
 * If no valid priority is provided (i.e., `priorityType` is `null`), the default priority type "medium" is applied.
 * 
 * The function targets three types of priority: "urgent", "medium", and "low", and modifies the button 
 * styles for each accordingly.
 * 
 * @param {string|null} priorityType - The priority type to set for the task. This can be "urgent", "medium", or "low". 
 *                                    If `null`, the default "medium" priority is applied.
 * @param {number} idVariable - The unique identifier for the task, used to apply styles to specific elements (buttons/images).
 * 
 * @returns {void} This function does not return a value. It modifies the DOM elements associated with the task priority buttons.
 */
function setButtonColorForPrio(priorityType, idVariable) {
    resetButtonStyles(idVariable);
    if (priorityType === null) {
        priorityType = 'medium';
    }
    if (priorityType === "urgent") {
        document.getElementById(`urgentButton${idVariable}`).style.backgroundColor = '#FF3D19';
        document.getElementById(`urgentButton${idVariable}`).style.color = 'white';
        document.getElementById(`urgentButtonImg${idVariable}`).src = './assets/img/prio-urgent-white.svg';
    } else if (priorityType === "medium") {
        document.getElementById(`mediumButton${idVariable}`).style.backgroundColor = '#FFA827';
        document.getElementById(`mediumButton${idVariable}`).style.color = 'white';
        document.getElementById(`mediumButtonImg${idVariable}`).src = './assets/img/prio-medium-white.svg';
    } else if (priorityType === "low") {
        document.getElementById(`lowButton${idVariable}`).style.backgroundColor = '#7AE22B';
        document.getElementById(`lowButton${idVariable}`).style.color = 'white';
        document.getElementById(`lowButtonImg${idVariable}`).src = './assets/img/prio-low-white.svg';
    }
}

/**
 * Resets the styles of the priority buttons to their default state.
 * 
 * This function is used to remove any custom styles (background color, text color, and image) 
 * applied to the priority buttons. It resets the buttons to their initial, unselected state, 
 * with default icons and no background color. This is useful when switching between different 
 * priority types or clearing the button selection.
 * 
 * The function targets three buttons for the priority types: "urgent", "medium", and "low", 
 * and restores their default styles.
 * 
 * @param {number} idVariable - The unique identifier for the task, used to identify and reset the styles of the specific priority buttons for that task.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM elements associated with the priority buttons.
 */
function resetButtonStyles(idVariable) {
    document.getElementById(`urgentButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`urgentButton${idVariable}`).style.color = '';
    document.getElementById(`urgentButtonImg${idVariable}`).src = './assets/img/prio_urgent.svg';
    document.getElementById(`mediumButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`mediumButton${idVariable}`).style.color = '';
    document.getElementById(`mediumButtonImg${idVariable}`).src = './assets/img/prio_medium.svg';
    document.getElementById(`lowButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`lowButton${idVariable}`).style.color = '';
    document.getElementById(`lowButtonImg${idVariable}`).src = './assets/img/prio_low.svg';
}

/**
 * Sets the selected category for a task and updates the UI accordingly.
 * 
 * This function is called when a category is chosen from the category dropdown menu. 
 * It updates the category header text, hides the category dropdown menu, 
 * and restores the dropdown toggle icon to the default state. 
 * The selected category is saved and used to check if the task creation button can be enabled.
 * 
 * @param {string} category - The name of the category that has been selected. 
 * It is used to update the displayed category and save it for later use in the task creation process.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM elements 
 * and updates the `selectedCategory` variable.
 */
function setCategory(category) {
    let categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    let imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    document.getElementById('category-header').innerText = category;
    categoryDropdownMenu.classList.add('d-none');
    imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    selectedCategory = category;
    checkIfCreateTaskButtonCanBeEnabled();
}