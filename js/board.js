let currentDraggedElement;
let allToDos;
let bigTaskActive;
let searchedTask = [];
let editTaskOpen;
let checkboxId = 1;

async function initBoard() {
  await init("board");
  boardJS();
}

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
  console.log("todos", toDos);

  allToDos = Object.entries(toDos);
  console.log(allToDos);

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
  console.log("filteredTodo", filteredToDos);
  document.getElementById(containerId).innerHTML = "";
  filteredToDos.forEach((element) => {
    document.getElementById(containerId).innerHTML += htmlTechnicalTaskSmall(element);
    console.log("element", element);
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

function renderAssignedToBigTask(element) {
  let assignedToEntries = Object.entries(element[1]["assignedTo"] || {});
  document.getElementById(`bigAssignedTo${element[1]["id"]}`).innerHTML = "";
  assignedToEntries.forEach(([key, value]) => {
    let backgroundColor = getAssignedBackgroundColor(key, value);
    document.getElementById(`bigAssignedTo${element[1]["id"]}`).innerHTML += /*HTML*/ `
        <div class="d-flex alic gap1">
        <div class="circle" style = "background-color: ${backgroundColor}">${value}</div>
        <div>${key}</div>
        </div>
      `;
  });
}

function renderAssignedToSmallTask(element, context = "default") {
  let assignedToEntries = Object.entries(element[1]["assignedTo"] || {});

  assignedToEntries.forEach(([key, value]) => {
    let backgroundColor = getAssignedBackgroundColor(key, value);
    document.getElementById(`assignedTo${element[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
          <div class="smallCircleUserStory" style = "background-color: ${backgroundColor}">
            ${value}
          </div>
        `;
  });
}

function renderSubTask(task, context = "default") {
  let subTaskToEntries = Object.entries(task[1]["subtasks"]);
  console.log("Subtask", subTaskToEntries[0][1]["value"]);
  subTaskToEntries.forEach(([, value]) => {
    console.log("Teste den Value", value.task);
    if (context == "bigTask") {
      returnSubTask(task, context, value);
    } else {
      returnEditableSubTask(task, context, value);
      console.log("123", value);
    }
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

function returnEditableSubTask(task, context, value) {
  document.getElementById(`subTask${task[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
      <ul id="${value.task}" class="subTaskList subTaskHover">
        <li id="${value.task}_edit" contenteditable="false">${value.task}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask(${value.task},'edit')" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask(${value.task})" src="./assets/img/delete.svg" alt="">
        </div>
  </ul>
      `;
}

async function editTask(task) {
  let rightTask = allToDos.filter((id) => id[1]["id"] == task);
  let firstLevelArray = rightTask[0];
  rightTask = rightTask[0][1];
  let fireBaseDate = rightTask.date;
  let date = getRightTimeZone(fireBaseDate);
  let container = document.getElementById("bigTaskCard");
  console.log("rightTask", rightTask);
  container.innerHTML = await editTaskBoard(rightTask, date);
  renderAssignedToSmallTask(firstLevelArray, "editTask");
  renderSubTask(firstLevelArray, "editTask");
  highlightRightPriority(rightTask);
  editTaskOpen = true;
}

function editSubTask(id, context = "default") {
  console.log("id", id);
  console.log("id.id", id.id);
  let changeField = document.getElementById(`${id.id}`);
  let task = document.getElementById(`${id.id}_${context}`);
  if (task.contentEditable === "false") {
    changeField.innerHTML = changeToInputField(id);
    changeClassesOnList(id);
    focusInputField(id);
  }
  console.log("Editier FUnktioniert");
}

function changeToInputField(id) {
  return `
    <input class="inputFieldEdit" id="${id.id}_input" type="text" value="${id.id}">
    <img onclick="deleteSubTask(${id.id})" src="./assets/img/delete.svg" alt="">
    <img onclick="changeBackToList(${id.id})" src="./assets/img/checked_subtask.svg" alt="">
    `;
}

function changeClassesOnList(id) {
  document.getElementById(id.id).classList.toggle("subTaskList");
  document.getElementById(id.id).classList.toggle("subTaskHover");
  document.getElementById(id.id).classList.toggle("inputFieldDesign");
}

function changeBackToList(id) {
  let changeField = document.getElementById(`${id.id}`);
  changeField.innerHTML = /*HTML*/ `
    <li id="${id.id}_edit" contenteditable="false">${id.id}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask(${id.id},'edit')" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask(${id.id})" src="./assets/img/delete.svg" alt="">
        </div>
  `;
  changeClassesOnList(id);
}

function deleteSubTask(id) {
  let element = document.getElementById(id.id);
  element.remove();
  console.log("LöschenFUnktionierte", id.id);
}

function calculateSubtaskProgress(element) {
  let elementToSubTaskArray = Object.entries(element[1]["subtasks"]);
  let subTaskLenght = elementToSubTaskArray.length;
  let checkedSubTasks = elementToSubTaskArray.filter((checked) => checked[1]["status"] == true);
  document.getElementById(`subTaskSmall${element[1]["id"]}`).innerHTML = `${checkedSubTasks.length}/${subTaskLenght} Subtasks`;
  let progressBarPercentage = (checkedSubTasks.length / subTaskLenght) * 100;
  document.getElementById(`progressbar${element[1]["id"]}`).style.width = progressBarPercentage + "%";
}

function openTask(id) {
  let task = allToDos.filter((task) => task[1]["id"] == id);
  showTask(task[0]);
  console.log("Task test", task);
}

function showTask(task) {
  document.getElementById("bigTask").style.display = "flex";
  document.getElementById("bigTask").innerHTML = technicalTaskBig(task);
  document.getElementById("bigTaskCard").classList.add("show");
  bigTaskActive = true;
  console.log("task", task);
  renderSubTask(task, "bigTask");
  renderAssignedTo(task);
  getRightUserColor(task);
  getRightPriority(task);
}

function closeBigTask() {
  if (editTaskOpen) {
    document.getElementById("svgUrgent").style.color = "#ff3d00";
    document.getElementById("svgMedium").style.color = "#ffa800";
    document.getElementById("svgLow").style.color = "#7ae229";
    document.getElementById("bigTask").style.display = "none";
  } else {
    document.getElementById("bigTask").style.display = "none";
  }
  bigTaskActive = false;
  editTaskOpen = false;
  updateHTML();
}

async function changeTitleOrDescriptionInFirebase(id, context = null) {
  let title = document.getElementById(id + "_" + context).value;
  let getTaskId = await getIdFromDb("/toDos", "id", id);
  let path = "/toDos/" + getTaskId + "/" + context;
  putData(path, title);
}

function addNewSubTask(id, context = null) {
  console.log("TesteSubTask", id, context);
  let subTaskValue = document.getElementById("subtasks-input").value;
  let subTaskContainer = document.getElementById("subTask"+ id + "_" + context);
  subTaskContainer.innerHTML += returnNewSubTaskHtml(subTaskValue, subTaskContainer);
  addSubTaskInFireBase(subTaskValue, id);
}

async function addSubTaskInFireBase(subTaskValue, id) {
  let getTaskId = await getIdFromDb("/toDos", "id", id)
  let subtask = {
    status: false,
    task: subTaskValue,
  };
  postData("/toDos/" + getTaskId + "/subtasks", subtask)
}

// Sicherung ToDos anlegen
// await postData('/toDos',{headline:'Kochwelt Page & Recipe Recommender', id: 1, category:'done', description:'Build start page with recipe recommendation', assignedTo: {user1: 1, user2: 2, user3: 3}, subtasks:{task1: 1, task2: 2}, priority: 'medium', date: 'Datum', story: {userStory: 'User Story', technicalTask:'Technical Task'}})
// await postData('/toDos/-O8rk7TAjcfN0IUq3qmd/subtasks',{status:true, value: 'duschen'})
