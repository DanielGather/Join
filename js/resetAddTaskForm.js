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