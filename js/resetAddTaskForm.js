/**
 * Resets the task form and associated UI elements to their initial states.
 * Clears input fields, resets selection elements, removes rendered content, 
 * and restores default settings for the task creation form.
 * 
 * @returns {void} This function does not return a value.
 */
function clear() {
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('textForDescription').value = '';
    document.getElementById('inputDate').value = '';
    document.getElementById('subtasks-input').value = '';
    priority = null;
    setButtonColorForPrio(null, "AddTask");
    document.getElementById('category-header').innerText = 'Select task category';
    selectedCategory = null;
    document.getElementById('dropDownMenu').innerHTML = '';
    document.getElementById('renderedInitialsContainer').innerHTML = '';
    document.getElementById('rendered-task-container').innerHTML = '';
    document.getElementById('rendered-task-container').classList.add('d-none');
    subtaskArray = [];
    resetCheckboxes();
}

/**
 * Resets all checkboxes in the contacts dropdown and clears associated data.
 * 
 * This function unchecks all checkboxes within the contacts dropdown, clears the arrays 
 * that store the names, initials, and colors of the selected contacts, and sets the 
 * `assignedToContacts` variable to `null`. This is typically used when clearing the task's 
 * assigned contacts or resetting the state of the contact selection.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM elements and 
 * resets internal data variables.
 */
function resetCheckboxes() {
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    checkedContactNames = [];
    checkedContactInitials = [];
    checkedContactColors = [];
    assignedToContacts = null;
}