/**
 * Adds a new subtask to the list and updates the rendered view.
 * 
 * This function captures the input value from the "subtasks" input field, trims any leading 
 * or trailing whitespace, and adds the subtask to an array if the input is non-empty. 
 * After adding the subtask, the list of subtasks is re-rendered, and the input field 
 * is cleared. The action icons are then updated to show the "plus" icon while hiding 
 * other action icons. This function is typically used to add new subtasks to a task.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM and 
 * updates internal data variables (the subtask array).
 */
function addSubTask() {
    document.getElementById('rendered-task-container').classList.remove('d-none');
    let subtaskInput = document.getElementById('subtasks-input').value.trim();
    if (subtaskInput) {
        subtaskArray.push(subtaskInput);
        renderSubtasks();
    }
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
}

/**
 * Renders and updates the displayed list of subtasks within the task container.
 * 
 * This function clears the current content of the task container (`rendered-task-container`) 
 * and then loops through the `subtaskArray`, rendering each subtask by appending 
 * generated HTML to the container. The HTML for each subtask is generated using 
 * the `temp_generateHtmlRenderSubtasks` function. Each subtask is displayed in the 
 * order it appears in the `subtaskArray`.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM 
 * to display the updated list of subtasks.
 */
function renderSubtasks() {
    let taskContainer = document.getElementById('rendered-task-container');
    taskContainer.innerHTML = '';
    for (let i = 0; i < subtaskArray.length; i++) {
        let subtask = subtaskArray[i];
        taskContainer.innerHTML += temp_generateHtmlRenderSubtasks(subtask, i);
    }
}

/**
 * Edits an existing subtask by rendering the editing HTML for the specified subtask.
 * 
 * This function takes the index of a subtask in the `subtaskArray`, locates the corresponding 
 * subtask element container in the DOM (identified by `subtask-List-Container-{index}`), 
 * and replaces its inner HTML with the HTML required to edit that particular subtask. 
 * The HTML for editing the subtask is generated using the `temp_generateHtmlEditSubtasks` function.
 *
 * @param {number} index - The index of the subtask to be edited within the `subtaskArray`.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM by updating
 * the inner HTML of the specified subtask container to enable editing.
 */
function editSubtask(index) {
    let subtaskElementContainer = document.getElementById(`subtask-List-Container-${index}`);
    subtaskElementContainer.innerHTML = temp_generateHtmlEditSubtasks(index);
}

/**
 * Saves the edited value of a subtask and updates the subtask list.
 * 
 * This function retrieves the edited value of a subtask from the input field, 
 * validates that the input is not empty, and if valid, updates the corresponding 
 * subtask in the `subtaskArray`. After updating, the subtasks are re-rendered 
 * to reflect the changes.
 * 
 * @param {number} index - The index of the subtask being edited in the `subtaskArray`.
 * 
 * @returns {void} This function does not return a value. It modifies the `subtaskArray` 
 * and re-renders the subtasks in the DOM to reflect the edited content.
 */
function saveEditSubtask(index) {
    let editedSubtaskValue = document.getElementById(`editInput-${index}`).value.trim();
    if (editedSubtaskValue) {
        subtaskArray[index] = editedSubtaskValue;
        renderSubtasks();
    }
}

/**
 * Cancels the subtask editing process and re-renders the list of subtasks.
 * 
 * This function is used to cancel the ongoing subtask editing operation. 
 * When called, it will simply re-render the current list of subtasks without 
 * saving any changes, thus restoring the previous state of the subtasks.
 * 
 * @returns {void} This function does not return a value. It triggers the re-rendering 
 * of the subtasks by calling the `renderSubtasks` function.
 */
function cancelEditSubtask() {
    renderSubtasks();
}

/**
 * Deletes a subtask from the list based on its index and re-renders the subtasks.
 * 
 * This function removes a subtask from the `subtaskArray` at the specified index 
 * and then re-renders the updated list of subtasks. It is typically used when a user 
 * wishes to remove a specific subtask from the list.
 * 
 * @param {number} index - The index of the subtask to be deleted from the `subtaskArray`.
 * @returns {void} This function does not return a value. It modifies the `subtaskArray` 
 * and calls `renderSubtasks` to update the displayed list of subtasks.
 */
function deleteSubtask(index) {
    subtaskArray.splice(index, 1);
    renderSubtasks();
}

/**
 * Toggles the visibility of the plus icon and the action icons for subtasks.
 * 
 * This function switches between showing the "plus" icon for adding a subtask 
 * and the "action" icons (such as edit or delete) for managing the subtasks. 
 * It is typically used to toggle the UI when interacting with the subtask input area.
 * 
 * @returns {void} This function does not return a value. It modifies the 
 * display styles of the `plusIcon` and `actionIcons` elements in the DOM.
 */
function toggleSubtaskIcons() {
    let plusIcon = document.getElementById('plusIcon');
    let actionIcons = document.getElementById('actionIcons');
    if (plusIcon.style.display === 'none') {
        plusIcon.style.display = 'block';
        actionIcons.style.display = 'none';
    } else {
        plusIcon.style.display = 'none';
        actionIcons.style.display = 'flex';
    }
}

/**
 * Clears the subtask input field and resets the subtask action icons.
 * 
 * This function resets the value of the subtask input field (`subtasks-input`) to an empty string.
 * It also hides the action icons and shows the "plus" icon, providing a clean state for the user 
 * to add a new subtask. This is typically used when a subtask has been cleared or canceled.
 * 
 * @returns {void} This function does not return any value. It modifies the DOM by clearing
 * the input field and changing the visibility of the action icons.
 */
function deleteInputSubtaskValue() {
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
}