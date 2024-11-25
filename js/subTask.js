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


function renderSubtasks() {
    let taskContainer = document.getElementById('rendered-task-container');
    taskContainer.innerHTML = '';
    for (let i = 0; i < subtaskArray.length; i++) {
        let subtask = subtaskArray[i];
        taskContainer.innerHTML += temp_generateHtmlRenderSubtasks(subtask, i);
    }
}


function editSubtask(index) {
    let subtaskElementContainer = document.getElementById(`subtask-List-Container-${index}`);
    subtaskElementContainer.innerHTML = temp_generateHtmlEditSubtasks(index);
}


function saveEditSubtask(index) {
    let editedSubtaskValue = document.getElementById(`editInput-${index}`).value.trim();
    if (editedSubtaskValue) {
        subtaskArray[index] = editedSubtaskValue;
        renderSubtasks();
    }
}


function cancelEditSubtask() {
    renderSubtasks();
}


function deleteSubtask(index) {
    subtaskArray.splice(index, 1);
    renderSubtasks();
}


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


function deleteInputSubtaskValue() {
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
}