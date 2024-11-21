/**
 * Appends an editable subtask to the appropriate container.
 * @param {Object} task - The parent task object containing the subtasks.
 * @param {string} context - The context in which the subtask should be displayed (e.g., "editTask").
 * @param {Object} value - The data of the specific subtask (e.g., name and properties).
 * @param {number} index - The index of the subtask in the list.
 * This function generates the HTML for an editable subtask based on the provided data and appends it
 * to the appropriate container. The container is identified by the ID `subTask{taskId}_{context}`.
 * To avoid ID conflicts, spaces are removed from the subtask value.
 */
function returnEditableSubTask(task, context, value, index) {
  let idWithNoSpace = value.task.replace(/\s+/g, "");
  document.getElementById(`subTask${task[1]["id"]}_${context}`).innerHTML += returnEditableSubTaskHTML(idWithNoSpace, task, value, index);
}

/**
 * Adds a new subtask to an existing task and updates the display.
 * @param {string} task - The ID of the task to which the subtask will be added.
 * @param {string|null} [context=null] - The context of the subtask (default: null).
 * This function creates a new subtask based on the input value in the `subtasks-input` field.
 * If a valid value is provided, the subtask is appended to the corresponding container and saved in Firebase.
 */
function addNewSubTask(task, context = null) {
  let counter = setCounter();
  let subTask = document.getElementById("subtasks-input");
  let subTaskValue = document.getElementById("subtasks-input").value;
  if (subTaskValue) {
    let idSubTaskValue = subTaskValue.replace(/\s+/g, "");
    let subTaskContainer = document.getElementById("subTask" + task + "_" + context);
    subTaskContainer.innerHTML += returnNewSubTaskHtml(subTaskValue, idSubTaskValue, counter, task);
    addSubTaskInFireBase(subTaskValue, task);
  }
  subTask.value = "";
}

/**
 * Edits an existing task and updates the UI accordingly.
 * @param {string} task - The ID of the task to be edited.
 * This function sets the editing mode for a specific task, retrieves the associated data,
 * and renders the updated task in the main container. Additionally, it highlights the
 * assigned users, subtasks, and task priority.
 */
async function editTask(task) {
  currentTaskId = task;
  editTaskOpen = true;
  let rightTask = allToDos.filter((id) => id[1]["id"] == task);
  let firstLevelArray = rightTask[0];
  rightTask = rightTask[0][1];
  let fireBaseDate = rightTask.date;
  let date = getRightTimeValue(fireBaseDate);
  let container = document.getElementById("bigTaskCard");
  container.innerHTML = await editTaskBoard(rightTask, date);
  renderAssignedTo(firstLevelArray, "editTask");
  renderSubTask(firstLevelArray, "editTask");
  highlightRightPriority(rightTask);
}

/**
 * Edits a subtask by transforming it into an input field and updating related classes.
 * @param {string} id - The ID of the subtask to be edited.
 * @param {string} [context="default"] - The context of the task (default: "default").
 * @param {number} index - The index of the subtask in the list.
 * @param {string} taskId - The ID of the parent task.
 * @param {string} valueTask - The current value of the subtask.
 * This function checks whether the `contentEditable` attribute of the task element is set to `"false"`.
 * If so, it converts the subtask's field into an input field, updates certain classes,
 * and focuses the input field.
 */
function editSubTask(id, context = "default", index, taskId, valueTask) {
  let changeField = document.getElementById(`${id}_${index}`);
  let task = document.getElementById(`${id}_${context}`);
  if (task.contentEditable === "false") {
    changeField.innerHTML = changeToInputField(id, index, taskId, valueTask);
    changeClassesOnList(id, index);
    focusInputField(id);
  }
}

/**
 * Generates HTML for editing a subtask, including an input field and action buttons.
 * @param {string} id - The base ID used to identify the subtask element.
 * @param {number} index - A unique identifier for the subtask to ensure proper element targeting.
 * @param {string} taskId - The ID of the parent task containing the subtask.
 * @param {string} valueTask - The current value of the subtask to be edited.
 * @returns {string} - A string of HTML containing an input field and action buttons for the subtask.
 */
function changeToInputField(id, index, taskId, valueTask) {
  return `
      <input class="inputFieldEdit" id="${id}_input" type="text" value="${valueTask}">
      <img onclick="deleteSubTask('${id}',${index},${taskId},'${valueTask}')" src="./assets/img/delete.svg" alt="">
      <img onclick="changeBackToList('${id}', ${index},${taskId},'${valueTask}')" src="./assets/img/checked_subtask.svg" alt="">
      `;
}

/**
 * Toggles specific CSS classes on a subtask list element to update its appearance.
 * @param {string} id - The base ID used to identify the list element.
 * @param {number} index - A unique identifier to distinguish the subtask from others.
 */
function changeClassesOnList(id, index) {
  document.getElementById(`${id}_${index}`).classList.toggle("subTaskList");
  document.getElementById(`${id}_${index}`).classList.toggle("subTaskHover");
  document.getElementById(`${id}_${index}`).classList.toggle("inputFieldDesign");
}

/**
 * Updates a task's display by changing an input field back to a list view,
 * applying necessary class changes and updating the subtask in the database.
 * @param {string} id - The base ID used for identifying the input and list elements.
 * @param {number} index - The index of the task in the list.
 * @param {string} taskId - The ID of the parent task containing the subtask.
 * @param {string} valueTask - The current value of the subtask to be updated.
 */
function changeBackToList(id, index, taskId, valueTask) {
  let changeField = document.getElementById(`${id}_${index}`);
  let newValue = document.getElementById(`${id}_input`).value;
  changeField.innerHTML = htmlChangeToList(id, newValue, taskId, valueTask, index);
  changeClassesOnList(id, index);
  updateSubTask(valueTask, newValue, taskId);
}

/**
 * Updates a subtask in the database with a new value.
 *
 * @param {string} valueTask - The current value of the subtask to be updated.
 * @param {string} newValue - The new value to set for the subtask.
 * @param {string} taskId - The ID of the parent task that contains the subtask.
 */
async function updateSubTask(valueTask, newValue, taskId) {
  let getTaskId = await getIdFromDb("/toDos", "id", taskId);
  let subTaskId = await getIdFromDb("/toDos/" + getTaskId + "/subtasks", "task", valueTask);
  let path = "/toDos/" + getTaskId + "/subtasks/" + subTaskId + "/task/";
  putData(path, newValue);
}

/**
 * Deletes a subtask from both the DOM and the database.
 * The function removes the subtask element from the UI, retrieves the task and subtask IDs from the database,
 * and deletes the subtask data from the database.
 * @param {string} idWithNoSpace - The ID of the subtask element in the DOM (without spaces).
 * @param {number} index - The index of the subtask within the task's subtasks.
 * @param {number} taskId - The unique identifier of the task containing the subtask.
 * @param {string} valueTask - The value or name associated with the subtask.
 **/
async function deleteSubTask(idWithNoSpace, index, taskId, valueTask) {
  let element = document.getElementById(idWithNoSpace + "_" + index);
  element.remove();
  let getTaskId = await getIdFromDb("/toDos", "id", taskId);
  let subTaskId = await getIdFromDb("/toDos/" + getTaskId + "/subtasks", "task", valueTask);
  deleteData("/toDos/" + getTaskId + "/subtasks/" + subTaskId);
}

/**
 * Updates data in Firebase based on the given ID, context, and priority.

 * @param {string} id - The unique ID of the item to update.
 * @param {string|null} [context=null] - The context indicating which property of the item to update (e.g., "title", "date").
 * @param {string|null} [priority=null] - An optional value that takes precedence over the default value retrieved from the DOM.
 * This function determines the new value for a field based on the provided context and priority. 
 * If the context is "date", the `changeTimeFormat` function is used to adjust the title's format. 
 * Finally, the `putData` function is called to send the updated data to the specified path in the Firebase database.
 **/

async function changeDataInFireBase(id, context = null, priority = null) {
  let title;
  if (!priority) {
    title = document.getElementById(id + "_" + context).value;
  } else {
    title = priority;
  }
  let getTaskId = await getIdFromDb("/toDos", "id", id);
  let path = "/toDos/" + getTaskId + "/" + context;
  if (context == "date") {
    title = changeTimeFormat(title);
  }
  putData(path, title);
}

/**
 * Adds a new subtask to Firebase.
 * - Retrieves the task ID from the database based on the provided ID.
 * - Trims unnecessary whitespace from the subtask value.
 * - Creates a subtask object with an initial status of `false` and the provided description.
 * - Saves the subtask object to Firebase under the task with the retrieved ID.
 * @param {string} subTaskValue - The text of the new subtask.
 * @param {string} id - The ID of the parent task to which the subtask is added.
 */
async function addSubTaskInFireBase(subTaskValue, id) {
  let getTaskId = await getIdFromDb("/toDos", "id", id);
  subTaskValue = subTaskValue.trim();
  let subtask = {
    status: false,
    task: subTaskValue,
  };
  postData("/toDos/" + getTaskId + "/subtasks", subtask);
}

function setFocusOnDate(id) {
  document.getElementById(id + "_date").focus();
}

/**
 * The function deletes a task from the database
 *
 * @param {integer} taskId - Delivers the number of the corresponding elements
 */
async function deleteTask(taskId) {
  let getTaskId = await getIdFromDb("/toDos", "id", taskId);
  deleteData("/toDos/" + getTaskId);
  closeBigTask();
  updateHTML();
}

/**
 * This function triggers the form and checks whether the required fields are empty.
 *
 * @param {event} event - Triggers the Event.
 * @param {integer} id - Delivers the number of the corresponding elements.
 */
function triggerForm(event, id) {
  event.preventDefault();
  let headlineInputValue = document.getElementById(`${id}_headline`).value;
  let dateInputValue = document.getElementById(`${id}_date`).value;
  if (headlineInputValue !== "" && dateInputValue !== "") {
    closeBigTask();
  }
}

/**
 * The function is there to ensure that the form button is still triggered when you click next to the open task.
 * @param {boolean} editTaskOpen - editTaskOpen is a global variable that checks whether the task is currently only open or whether it is currently in edit mode.
 */
function triggerButton() {
  if (editTaskOpen == false) {
    closeBigTask();
  } else {
    document.getElementById("createTaskEdit").click();
    // document.querySelector("form").submit();
  }
}

/**
 * Adds or removes a user from the `assignedTo` list of a task in Firebase,
 * based on the state of a checkbox.
 * This function retrieves the task ID and variables needed to update the
 * `assignedTo` list in Firebase. If the checkbox associated with the user is
 * checked, it adds the user's email to the `assignedTo` list. If unchecked, it
 * removes the user from the list using `removeAssignedToFromFireBase`.
 * @param {string} email - The email address of the user to be added or removed.
 */
async function addAssignedToToFireBase(email) {
  objectArray = {};
  let getTaskId = await getIdFromDb("/toDos", "id", currentTaskId);
  let myVariablesObject = await returnMyVariables(email, getTaskId);
  let checkBoxContainer = document.getElementById(email);
  if (myVariablesObject.toDo !== null) {
    let toDoEntries = Object.entries(myVariablesObject.toDo);
    toDoEntries.forEach(([key, value]) => {
      objectArray[key] = value;
    });
  }
  if (checkBoxContainer.checked) {
    objectArray["userEmail" + myVariablesObject.number] = myVariablesObject.email;
    putData(myVariablesObject.path, objectArray);
  } else {
    removeAssignedToFromFireBase(myVariablesObject.email, getTaskId);
  }
}

/**
 * Removes a user from the `assignedTo` list of a task in Firebase.
 * This function retrieves the `assignedTo` entries of a task from Firebase and
 * checks if the specified email address is present in the entries. If a matching
 * entry is found, it deletes the corresponding entry in Firebase using its key.
 * @param {string} email - The email address of the user to be removed.
 * @param {string} getTaskId - The ID of the task from which the user will be removed.
 **/
async function removeAssignedToFromFireBase(email, getTaskId) {
  let toDo = await getData("/toDos/" + getTaskId + "/assignedTo");
  let toDoEntries = Object.entries(toDo);
  toDoEntries.forEach(([key, value]) => {
    if (value == email) {
      path = `/toDos/${getTaskId}/assignedTo/${key}`;
    } else {
      return;
    }
  });
  deleteData(path);
}

/**
 * Updates the status of a subtask based on the state of a checkbox.
 * @param {string} checkboxId - The ID of the checkbox in the DOM.
 * @param {string} toDoId - The ID of the main task (to-do).
 * @param {string} value - A JSON string containing the subtask data.
 * This function checks whether a checkbox is checked or unchecked and updates the status of
 * the associated subtask in the database accordingly.
 */
async function checkCheckbox(checkboxId, toDoId, value) {
  let newValue = JSON.parse(value);
  let checkbox = document.getElementById(`checkbox${checkboxId}`);
  let getTaskId = await getIdFromDb("/toDos", "id", toDoId);
  let subTaskId = await getIdFromDb("/toDos/" + getTaskId + "/subtasks", "task", newValue.task);
  if (checkbox.checked) {
    putData("/toDos/" + getTaskId + "/subtasks/" + subTaskId + "/status", true);
  } else {
    putData("/toDos/" + getTaskId + "/subtasks/" + subTaskId + "/status", false);
  }
}

/**
 * Dynamically adds a subtask as an HTML element to the DOM.
 *
 * @param {Object} task - The task object containing the subtask data.
 * @param {string} context - The context in which the subtask is being rendered (e.g., "editTask" or "bigTask").
 * @param {Object} value - The subtask object with details like `task` (name) and `status` (completed/open).
 * This function creates a new `div` element for a subtask and appends it to a specific container element in the DOM.
 * - Each subtask includes a checkbox and a label.
 * - The checkbox's status (`checked`) is set based on `value.status`.
 * - Subtask data is stored in the `data-value` attribute.
 * - Clicking the checkbox triggers the `checkCheckbox` function.
 * The variable `checkboxId` is used to generate a unique ID for each checkbox and is incremented by 1 with each function call.
 */
function returnSubTask(task, context, value) {
  document.getElementById(`subTask${task[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
    <div class="singleSubTask"><input id="checkbox${checkboxId}" onclick="checkCheckbox(${checkboxId}, ${task[1]["id"]}, this.dataset.value)" type="checkbox" ${value.status ? "checked" : ""} data-value='${JSON.stringify(value)}'  /><span>${value.task}</span></div>
    `;
  checkboxId += +1;
}
