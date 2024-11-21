let currentDraggedElement;
let allToDos;
let bigTaskActive;
let searchedTask = [];
let editTaskOpen = false;
let checkboxId = 1;
let currentTaskId;
let testArray = {};

/**
 * Initializes the board by rendering the board, updating the navbar, and refreshing the HTML content.
 * The function calls `renderBoard()` to display the board, `navbarTemplate()` to update the navbar, 
 * and `updateHTML()` to refresh the displayed content for the tasks.
 */
function boardJS() {
  renderBoard();
  navbarTemplate();
  updateHTML();
}

/**
 * Renders the main board by updating the HTML content of the `main-board` container with the generated board HTML.
 * The function calls `boardHtml()` to generate the HTML structure for the board and then updates the `main-board` container's inner HTML.
 */
function renderBoard() {
  let htmlContent = document.getElementById("main-board");
  htmlContent.innerHTML = boardHtml();
}

/**
 * Asynchronously updates the HTML content by fetching the latest to-do data and rendering it into the appropriate categories.
 * The function retrieves the to-do data, categorizes it, and updates the HTML containers for each category (e.g., "toDo", "inProgress", etc.).
 */
async function updateHTML() {
  let toDos = await getData("toDos");
  allToDos = Object.entries(toDos);
  const categories = [
    { name: "toDo", containerId: "toDo" },
    { name: "inProgress", containerId: "inProgress" },
    { name: "awaitFeedback", containerId: "awaitFeedback" },
    { name: "done", containerId: "done" },
  ];
  categories.forEach((category) => updateCategoryHTML(category.name, category.containerId, allToDos));
}

/**
 * Updates the HTML content for a given category by filtering the To-Do items based on the category 
 * and rendering them within the specified container.
 * The function retrieves the relevant To-Do items, filters them based on the category, and appends
 * the corresponding HTML representations to the specified container. It also calls additional functions
 * for rendering assigned contacts, calculating progress, and applying category-specific styles.
 * @param {string} category - The category to filter To-Do items by.
 * @param {string} containerId - The ID of the container where the filtered To-Do items will be rendered.
 * @param {Array} allToDos - An array containing all To-Do items.
 */
function updateCategoryHTML(category, containerId, allToDos) {
  let toDoArray = getRightArray(allToDos);
  let filteredToDos = toDoArray.filter((t) => t[1]["category"] === category);
  document.getElementById(containerId).innerHTML = "";
  filteredToDos.forEach((element) => {
    document.getElementById(containerId).innerHTML += htmlTechnicalTaskSmall(element);
    renderAssignedTo(element);
    calculateSubtaskProgress(element);
    getRightUserColor(element);
    getRightPriority(element);
  });
  checkChildElement();
}

/**
 * Searches for a task based on the user input and updates the displayed results accordingly.
 * If the input has at least 3 characters, it triggers a search for the relevant task. If no input is provided, 
 * it clears the search results.
 * The function hides the "no results" message, processes the input, and then either searches for the task or clears the results.
 * @param {string} id - The unique identifier for the search input field and the associated "no results" message.
 */
function searchTask(id) {
  document.getElementById(`${id}NoResultsMessage`).style.display = "none";
  let input = checkInput(id);
  if (input.length >= 3) {
    searchRightTask(input, id);
    updateHTML();
  } else if (input.length == 0) {
    searchedTask = [];
    updateHTML();
  }
}

/**
 * Renders the assigned contacts for a task based on the task type (big or small).
 * If the task is a big task, it calls `renderAssignedToBigTask`, otherwise it calls `renderAssignedToSmallTask` with a specific ID.
 * @param {Object} element - The task element containing the assigned contacts to be rendered.
 */
function renderAssignedTo(element) {
  if (bigTaskActive) {
    renderAssignedToBigTask(element);
  } else {
    renderAssignedToSmallTask(element, "taskSmall");
  }
}

/**
 * Asynchronously renders the contacts dropdown for a given task by first toggling the dropdown visibility
 * and then updating the checkboxes based on the task ID.
 * This function relies on the helper functions `toggleAssignedToDropDown` and `updateCheckbox`.
 * @param {string} taskId - The unique identifier of the task for which the contacts dropdown is being rendered.
 */
async function renderContactsDropDown(taskId) {
  await toggleAssignedToDropDown();
  updateCheckbox(taskId);
}

/**
 * Asynchronously updates the checkboxes for a given task by first unchecking all checkboxes
 * and then setting the checkboxes based on data from Firebase.
 * This function relies on the helper functions `uncheckCheckboxen` and `setCheckboxesBasedOnFirebaseData`.
 * @param {string} taskId - The unique identifier of the task for which the checkboxes are being updated.
 */
async function updateCheckbox(taskId) {
  uncheckCheckboxen();
  setCheckboxesBasedOnFirebaseData(taskId);
}

/**
 * This function renders the assigned contacts when a task is opened. 
 * For each contact, their initials are displayed in a colored circle, along with their full name.
 * The contact information is extracted from the `assignedTo` property of the provided task object.
 * @param {Object} element - The task element containing the assigned contacts.
 * @param {Array} element[1]["assignedTo"] - An object containing the contacts assigned to the task. 
 * Each key is a contact ID, and the value contains the corresponding contact details.
 */
function renderAssignedToBigTask(element) {
  let assignedToEntries = Object.entries(element[1]["assignedTo"] || {});
  document.getElementById("renderedInitialsContainer").innerHTML = "";
  assignedToEntries.forEach(([, value]) => {
    let contact = getContact(value);
    document.getElementById("renderedInitialsContainer").innerHTML += /*HTML*/ `
        <div class="d-flex alic gap1">
        <div class="circle" style = "background-color: ${contact.color}">${contact.initials}</div>
        ${!editTaskOpen ? `<div>${contact.name}</div>` : ""}
        </div>
      `;
  });
}

/**
 * Renders the "Assigned To" contacts as small circles (avatars) for a task.
 * 
 * @param {Object} element - The task object containing the "Assigned To" data.
 * @param {string} [context="default"] - The context in which the contacts should be rendered (e.g., "editTask").
 * This function creates visual representations of the assigned contacts ("Assigned To") for a task.
 * Each contact is displayed as a small circle (avatar) with individual initials and a color.
 * - The function checks if the list of contacts (`assignedTo`) exists in the task object. If not, an empty list is used.
 * - Tasks with more than 8 contacts are styled with additional margins (`newMargin`) for better layout.
 * - The background color and initials of the contacts are determined using the `getContact` function.
 */
function renderAssignedToSmallTask(element, context = "default") {
  let assignedToEntries = Object.entries(element[1]["assignedTo"] || {});
  let AddNewMargin = assignedToEntries.length >= 8;
  assignedToEntries.forEach(([, value], index) => {
    let contact = getContact(value);
    // document.getElementById(contact.email).checked = true;
    let newClass = AddNewMargin && index !== 0 ? "newMargin" : "";
    document.getElementById(`assignedTo${element[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
          <div class="${newClass} smallCircleUserStory" style = "background-color: ${contact.color}">
            ${contact.initials}
          </div>
        `;
  });
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
  <div class="singleSubTask"><input id="checkbox${checkboxId}" onclick="checkCheckbox(${checkboxId}, ${task[1]['id']}, this.dataset.value)" type="checkbox" ${value.status ? "checked" : ""} data-value='${JSON.stringify(value)}'  /><span>${value.task}</span></div>
  `;
  checkboxId += +1;
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
 * Renders the subtasks of a task based on the specified context.
 * @param {Object} task - The parent task object containing the subtasks.
 * @param {string} [context="default"] - The context in which the subtasks should be rendered (default: "default").
 * This function checks if the provided task object contains subtasks. If subtasks are present, it iterates over them 
 * and calls either `returnSubTask` (for the "bigTask" context) or `returnEditableSubTask` (for other contexts), 
 * depending on the context specified.
 */
function renderSubTask(task, context = "default") {
  if (task[1]["subtasks"]) {
    let subTaskToEntries = Object.entries(task[1]["subtasks"]);
    subTaskToEntries.forEach(([, value], index) => {
      if (context == "bigTask") {
        returnSubTask(task, context, value);
      } else {
        returnEditableSubTask(task, context, value, index);
      }
    });
  }
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
 * Calculates and updates the progress of subtasks for a given task element.
 * Displays the number of completed subtasks and updates the progress bar accordingly.
 * Removes the progress bar if no subtasks are defined.
 *
 * @param {Object} element - The task element containing subtasks.
 **/
function calculateSubtaskProgress(element) {
  let id = element[1]["id"];
  if (element[1]["subtasks"] !== undefined) {
    let elementToSubTaskArray = Object.entries(element[1]["subtasks"]);
    let subTaskLenght = elementToSubTaskArray.length;
    let checkedSubTasks = elementToSubTaskArray.filter((checked) => checked[1]["status"] == true);
    document.getElementById(`subTaskSmall${element[1]["id"]}`).innerHTML = `${checkedSubTasks.length}/${subTaskLenght} Subtasks`;
    let progressBarPercentage = (checkedSubTasks.length / subTaskLenght) * 100;
    document.getElementById(`progressbar${element[1]["id"]}`).style.width = progressBarPercentage + "%";
  } else {
    document.getElementById("progressbarContainer" + id).remove();
  }
}

/**
 * Opens a specific task based on the provided ID.
 * Searches for the task in the list of all to-dos (`allToDos`) and displays it.
 * @param {number|string} id - The unique ID of the task to be opened.
 **/
function openTask(id) {
  let task = allToDos.filter((task) => task[1]["id"] == id);
  showTask(task[0]);
}

/**
 * Displays the details of a task in the "Big Task" view and updates its UI elements.
 *
 * @param {Object} task - The task object containing details to display.
 * This function displays the task details in the "Big Task" view by setting the display style of the "bigTask" element to "flex",
 * populating it with the content returned by `technicalTaskBig(task)`, and showing the "bigTaskCard" element.
 * Additionally, it updates the task-related UI components, such as rendering subtasks, assigning the task to a user,
 * displaying the correct priority, and setting up the task's color based on the assigned user.
 **/
function showTask(task) {
  document.getElementById("bigTask").style.display = "flex";
  document.getElementById("bigTask").innerHTML = technicalTaskBig(task);
  document.getElementById("bigTaskCard").classList.add("show");
  bigTaskActive = true;
  renderSubTask(task, "bigTask");
  renderAssignedTo(task);
  getRightUserColor(task);
  getRightPriority(task);
}

/**
 * Closes the "Big Task" view and the "Add Task" board, and resets relevant flags.
 *
 * This function hides the elements with the IDs "bigTask" and "addTaskBoard" by setting their CSS display property to "none".
 * It also resets the flags `bigTaskActive` and `editTaskOpen` to `false`, and then calls `updateHTML` to refresh the page.
 **/
function closeBigTask() {
  document.getElementById("bigTask").style.display = "none";
  document.getElementById("addTaskBoard").style.display = "none";
  bigTaskActive = false;
  editTaskOpen = false;
  updateHTML();
}

/**
 * Closes the "Add Task" board by setting its display style to "none".
 **/
function closeAddTask() {
  document.getElementById("addTaskBoard").style.display = "none";
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
 * Displays the interface for adding a new task, depending on the window width.
 *
 * - If the window width is greater than or equal to 1000 pixels:
 *   - The element with the ID "addTaskBoard" is made visible and displayed as a flexbox.
 *   - The element with the ID "boardAddTask" is given the CSS class "show".
 *   - The content of the "boardAddTask" container is populated with HTML for adding a task.
 * - If the window width is less than 1000 pixels:
 *   - The user is redirected to the page "./add_task.html".
 */
function showAddTask() {
  if (window.innerWidth >= 1000) {
    document.getElementById("addTaskBoard").style.display = "flex";
    let addTaskContainer = document.getElementById("boardAddTask");
    document.getElementById("boardAddTask").classList.add("show");
    addTaskContainer.innerHTML = returnAddTaskHtml();
  } else {
    window.location.href = "./add_task.html";
  }
  setButtonColorForPrio(statusPriority, "AddTask");
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




