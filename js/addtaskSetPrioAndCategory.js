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
 * The `setCategory` function sets the selected category and updates the category display in the HTML.
 * It updates the text of the element with the ID `category-header` and stores the selected category
 * in the global variable `selectedCategory`. Afterward, it checks whether the "Create Task" button
 * can be enabled based on the selected category.
 *
 * @param {string} category - The name or label of the selected category that will be displayed in the UI
 *                             and stored. This value should be a string that describes the desired category
 *                             (e.g., "Work", "Shopping", "Personal").
 *
 * @returns {void} - This function does not return anything. It performs DOM manipulation and calls
 *                   another function (`checkIfCreateTaskButtonCanBeEnabled`) to check the state of the task button.
 */
function setCategory(category) {
    document.getElementById('category-header').innerText = category;
    selectedCategory = category;
    checkIfCreateTaskButtonCanBeEnabled();
}