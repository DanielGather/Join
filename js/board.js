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
async function closeBigTask() {
  document.getElementById("bigTask").style.display = "none";
  document.getElementById("addTaskBoard").style.display = "none";
  bigTaskActive = false;
  editTaskOpen = false;
  await updateHTML();
}

/**
 * Displays the "Add Task" form on the current page or redirects to another page for smaller screens.
 * The task type is used to dynamically generate content for the task form.
 * @param {string} type - The type of the task, which influences the content displayed in the form.
 */
function showAddTask(type) {
  if (window.innerWidth >= 1000) {
    document.getElementById("addTaskBoard").style.display = "flex";
    let addTaskContainer = document.getElementById("boardAddTask");
    document.getElementById("boardAddTask").classList.add("show");
    addTaskContainer.innerHTML = returnAddTaskHtml(type);
  } else {
    window.location.href = "./add_task.html";
  }
  setButtonColorForPrio(statusPriority, "AddTask");
  generateAddEventListener();
}

function generateAddEventListener() {
  EventListenerKeydownSubtaskInput();
  EventListenerKeydownTitleInput();
  EventListenerInputTitle();
  EventListenerChangeDate();
}

function EventListenerInputTitle() {
  const addTaskTitle = document.getElementById("addTaskTitle");
  if (addTaskTitle) {
    addTaskTitle.addEventListener("input", checkIfCreateTaskButtonCanBeEnabled);
  }
}

function EventListenerChangeDate() {
  const inputDate = document.getElementById("inputDate");
  if (inputDate) {
    inputDate.addEventListener("change", checkIfCreateTaskButtonCanBeEnabled);
  }
}

function EventListenerKeydownSubtaskInput() {
  const subtasksInput = document.getElementById("subtasks-input");
  if (subtasksInput) {
    subtasksInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addSubTask();
      }
    });
  }
}

function EventListenerKeydownTitleInput() {
  const addTaskTitle = document.getElementById("addTaskTitle");
  if (addTaskTitle) {
    addTaskTitle.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
  }
}

function openMenu(event, id) {
  event.stopPropagation();
  document.getElementById(`menuContainer${id}`).classList.toggle("showMenu");
  setTimeout(() => {
    document.getElementById(`menuContainer${id}`).classList.remove("showMenu");
  }, "3000");
}

async function moveCategoryInFirebase(event, category, id) {
  event.stopPropagation();
  let taskId = await getIdFromDb("/toDos", "id", id);
  await putData("/toDos/" + taskId + "/category", category);
  await updateHTML();
}