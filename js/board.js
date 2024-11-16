let currentDraggedElement;
let allToDos;
let bigTaskActive;
let searchedTask = [];
let editTaskOpen = false;
let checkboxId = 1;
let currentTaskId;
let testArray = {};

function boardJS() {
  renderBoard();
  navbarTemplate();
  updateHTML();
}

function renderBoard() {
  let htmlContent = document.getElementById("main");
  htmlContent.innerHTML = boardHtml();
}

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

function renderAssignedTo(element) {
  if (bigTaskActive) {
    renderAssignedToBigTask(element);
  } else {
    renderAssignedToSmallTask(element, "taskSmall");
  }
}

// function checkRightUser(){
//   let contact = getContact
// }

async function renderContactsDropDown(taskId, trueOrFalse) {
  await toggleAssignedToDropDown(trueOrFalse);
  updateCheckbox(taskId, trueOrFalse);
}

function updateCheckbox(taskId, trueOrFalse) {
  uncheckCheckboxen();
  setCheckboxesBasedOnFirebaseData(taskId);
}

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

function returnSubTask(task, context, value) {
  document.getElementById(`subTask${task[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
  <div class="singleSubTask"><input id="checkbox${checkboxId}" onclick="checkCheckbox(${checkboxId}, ${task[1]["id"]}, this.dataset.value)" type="checkbox" ${value.status ? "checked" : ""} data-value='${JSON.stringify(value)}'  /><span>${value.task}</span></div>
  `;
  checkboxId += +1;
}

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

function returnEditableSubTask(task, context, value, index) {
  let idWithNoSpace = value.task.replace(/\s+/g, "");
  console.log("idwithnospcae", idWithNoSpace);
  document.getElementById(`subTask${task[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
      <ul id="${idWithNoSpace}_${index}" class="subTaskList subTaskHover">
        <li id="${idWithNoSpace}_edit" contenteditable="false">${value.task}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask('${idWithNoSpace}','edit', ${index}, ${task[1]["id"]}, '${value.task}')" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask('${idWithNoSpace}', ${index}, ${task[1]["id"]}, '${value.task}') " src="./assets/img/delete.svg" alt="">
        </div>
  </ul>
      `;
}

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

function setCounter() {
  let counter = parseInt(localStorage.getItem("counter") || "0", 10);
  counter += 1;
  localStorage.setItem("counter", counter);
  return counter;
}

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
  // enterSubTask();
}

function editSubTask(id, context = "default", index, taskId, valueTask) {
  let changeField = document.getElementById(`${id}_${index}`);
  let task = document.getElementById(`${id}_${context}`);
  if (task.contentEditable === "false") {
    changeField.innerHTML = changeToInputField(id, index, taskId, valueTask);
    changeClassesOnList(id, index);
    focusInputField(id);
  }
}

function changeToInputField(id, index, taskId, valueTask) {
  return `
    <input class="inputFieldEdit" id="${id}_input" type="text" value="${valueTask}">
    <img onclick="deleteSubTask('${id}',${index},${taskId},'${valueTask}')" src="./assets/img/delete.svg" alt="">
    <img onclick="changeBackToList('${id}', ${index},${taskId},'${valueTask}')" src="./assets/img/checked_subtask.svg" alt="">
    `;
}

function changeClassesOnList(id, index) {
  document.getElementById(`${id}_${index}`).classList.toggle("subTaskList");
  document.getElementById(`${id}_${index}`).classList.toggle("subTaskHover");
  document.getElementById(`${id}_${index}`).classList.toggle("inputFieldDesign");
}

function changeBackToList(id, index, taskId, valueTask) {
  let changeField = document.getElementById(`${id}_${index}`);
  let newValue = document.getElementById(`${id}_input`).value;
  changeField.innerHTML = htmlChangeToList(id, newValue, taskId, valueTask, index);
  changeClassesOnList(id, index);
  updateSubTask(valueTask, newValue, taskId);
}

async function updateSubTask(valueTask, newValue, taskId) {
  let getTaskId = await getIdFromDb("/toDos", "id", taskId);
  let subTaskId = await getIdFromDb("/toDos/" + getTaskId + "/subtasks", "task", valueTask);
  let path = "/toDos/" + getTaskId + "/subtasks/" + subTaskId + "/task/";
  putData(path, newValue);
}

async function deleteSubTask(idWithNoSpace, index, taskId, valueTask) {
  let element = document.getElementById(idWithNoSpace + "_" + index);
  element.remove();
  let getTaskId = await getIdFromDb("/toDos", "id", taskId);
  let subTaskId = await getIdFromDb("/toDos/" + getTaskId + "/subtasks", "task", valueTask);
  deleteData("/toDos/" + getTaskId + "/subtasks/" + subTaskId);
}

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

function openTask(id) {
  let task = allToDos.filter((task) => task[1]["id"] == id);
  showTask(task[0]);
}

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

function closeBigTask() {
  if (editTaskOpen) {
    // document.getElementById("svgUrgent").style.color = "#ff3d00";
    // document.getElementById("svgMedium").style.color = "#ffa800";
    // document.getElementById("svgLow").style.color = "#7ae229";
    // document.getElementById("bigTask").style.display = "none";
  } else {
    document.getElementById("bigTask").style.display = "none";
    document.getElementById("addTaskBoard").style.display = "none";
  }
  bigTaskActive = false;
  editTaskOpen = false;
  updateHTML();
}

function closeAddTask() {
  document.getElementById("addTaskBoard").style.display = "none";
}

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
 * 
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
  setButtonColorForPrio(statusPriority);
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
 *
 * @param {boolean} editTaskOpen - editTaskOpen is a global variable that checks whether the task is currently only open or whether it is currently in edit mode.
 *
 */
function triggerButton() {
  if (editTaskOpen == false) {
    closeBigTask();
  } else {
    document.getElementById('createTaskEdit').click();
    // document.querySelector("form").submit();
  }
}

// async function addAssignedToToFireBase(checkbox){
//   let getTaskId = await getIdFromDb("/toDos", "id", currentTaskId);
//   let path = "/toDos/" + getTaskId + "/assignedTo";
//   let email = checkbox.id;
//   let number = setCounter();
//   let data = {[`userEmail${number}`]: email}
//   if (checkbox.checked) {
//   updateData(path,data)
// } else {
//   // deleteData();
//   removeAssignedToFromFireBase(email, getTaskId)
// }
// }

async function returnMyVariables(checkbox,getTaskId) {
  const myVariables = {
    path: "/toDos/" + getTaskId + "/assignedTo/",
    email: checkbox.id,
    number: setCounter(),
    toDo: await getData("/toDos/" + getTaskId + "/assignedTo"),
  };
  return myVariables
}
async function addAssignedToToFireBase(checkbox) {
  testArray = {};
  let getTaskId = await getIdFromDb("/toDos", "id", currentTaskId);
  let myVariablesObject = await returnMyVariables(checkbox, getTaskId);
  if(myVariablesObject.toDo !== null) {
  let toDoEntries = Object.entries(myVariablesObject.toDo);
  toDoEntries.forEach(([key, value]) => {
    testArray[key] = value;
  })};
  if (checkbox.checked) {
    testArray["userEmail" + myVariablesObject.number] = myVariablesObject.email;
    putData(myVariablesObject.path, testArray);
  } else {
    removeAssignedToFromFireBase(myVariablesObject.email, getTaskId);
  }
}

// function checkboxIsChecked() {}

// async function updateData(path = "", data = {}) {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "PATCH" /* or PATCH  || !!PATCH funktioniert nicht mit firebase */,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   let responseToJson = await response.json();
//   return responseToJson;
// }

async function removeAssignedToFromFireBase(email, getTaskId) {
  let toDo = await getData("/toDos/" + getTaskId + "/assignedTo");
  let toDoEntries = Object.entries(toDo);
  toDoEntries.forEach(([key, value]) => {
    console.log("value", key, value);
    if (value == email) {
      path = `/toDos/${getTaskId}/assignedTo/${key}`;
    } else {
      return;
    }
  });
  deleteData(path);
}
