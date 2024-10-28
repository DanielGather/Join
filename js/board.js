let currentDraggedElement;
let allToDos;
let bigTaskActive;
let searchedTask = [];
let editTaskOpen;

function boardJS() {
  renderBoard();
  navbarTemplate();
  updateHTML();
}

// TODO: SubTask berechnung durchführen für die Progressbar.
// TODO: Wenn man in der suche nichts findet, feedback an den User das es nicht exestiert.

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
  // clearTaskContainer();
  categories.forEach((category) => updateCategoryHTML(category.name, category.containerId, allToDos));
}

function getRightArray(allToDos) {
  if (searchedTask.length > 0) {
    let toDoArray = searchedTask;
    return toDoArray;
  } else {
    let toDoArray = allToDos;
    return toDoArray;
  }
}

function updateCategoryHTML(category, containerId, allToDos) {
  let toDoArray = getRightArray(allToDos);
  let filteredToDos = toDoArray.filter((t) => t[1]["category"] === category);
  console.log("filteredTodo", filteredToDos);

  // if (filteredToDos.length === 0) return;
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

function checkChildElement(){
  let elements = document.querySelectorAll('.allCategories');
  elements.forEach((element) => {
    if (!element.hasChildNodes()){
      let createDiv = document.createElement('div');
      createDiv.className = 'noTask d-flex alic jc-c colorGrey fs16'
      createDiv.textContent = 'No tasks To do';
      element.appendChild(createDiv);
    }
  })
}

function calculateSubtaskProgress(element) {
  let elementToSubTaskArray = Object.entries(element[1]["subtasks"]);
  let subTaskLenght = elementToSubTaskArray.length;
  let checkedSubTasks = elementToSubTaskArray.filter((checked) => checked[1]["status"] == true);
  document.getElementById(`subTaskSmall${element[1]["id"]}`).innerHTML = `${checkedSubTasks.length}/${subTaskLenght} Subtasks`;
  let progressBarPercentage = (checkedSubTasks.length / subTaskLenght) * 100;
  document.getElementById(`progressbar${element[1]["id"]}`).style.width = progressBarPercentage + "%";
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
    document.getElementById(`bigAssignedTo${element[1]["id"]}`).innerHTML += /*HTML*/ `
        <div class="d-flex alic gap1">
        <div class="circle">${value}</div>
        <div>${key}</div>
        </div>
      `;
  });
}

function renderAssignedToSmallTask(element, context = "default") {
  let assignedToEntries = Object.entries(element[1]["assignedTo"] || {});
  assignedToEntries.forEach(([, value]) => {
    document.getElementById(`assignedTo${element[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
          <div class="smallCircleUserStory">
            ${value}
          </div>
        `;
  });
}

function renderBoard() {
  let htmlContent = document.getElementById("main");
  let headerContent = document.getElementById("header");
  htmlContent.innerHTML = boardHtml();
  headerContent.innerHTML = returnHeaderHtml();
}

function startDraggin(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveToCategory(category) {
  let id = await getIdFromDb("/toDos", "id", currentDraggedElement);
  console.log("test", id);
  await putData("/toDos/" + id + "/category", category);
  renderBoard();
  await updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function checkInput(id) {
  let inputField = document.getElementById(id);
  let inputValue = inputField.value.trim();
  inputValue = inputValue.toLowerCase();
  return inputValue;
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

function searchRightTask(input, id) {
  searchedTask = [];
  let filteredTasks = allToDos.filter((task) => task[1]["headline"].toLowerCase().includes(input) || task[1]["description"].toLowerCase().includes(input));
  checkInputValueExist(filteredTasks, id);
  filteredTasks.forEach((element) => searchedTask.push(element));
}

function checkInputValueExist(filteredTasks, id) {
  if (filteredTasks.length == 0) {
    document.getElementById(`${id}NoResultsMessage`).style.display = "block";
  }
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

function renderSubTask(task, context = "default") {
  let subTaskToEntries = Object.entries(task[1]["subtasks"]);
  console.log("Subtask", subTaskToEntries[0][1]["value"]);
  subTaskToEntries.forEach(([, value]) => {
    console.log("Teste den Value", value.task);
    if (context == "bigTask") {
      returnSubTask(task, context, value);
    } else {
      returnEditableSubTask(task, context, value);
    }
  });
}

function returnSubTask(task, context, value) {
  document.getElementById(`subTask${task[1]["id"]}_${context}`).innerHTML += /*HTML*/ `
  <div class="singleSubTask"><input onclick="checkCheckbox()" type="checkbox" /><span>${value.task}</span></div>
  `;
}

function checkCheckbox(){
  console.log("CHeckbox funktioniert");
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
      `;
}

function editSubTask(id, context = "default") {
  console.log("id", id);
  console.log("id.id", id.id);
  
  let changeField = document.getElementById(`${id.id}`);
  let task = document.getElementById(`${id.id}_${context}`);
  if (task.contentEditable === "false") {
    changeField.innerHTML = returnInputField(id);
    changeClassesOnList(id);
    focusInputField(id);
  }
  console.log("Editier FUnktioniert");
}

function changeClassesOnList(id) {
  document.getElementById(id.id).classList.remove("subTaskList");
  document.getElementById(id.id).classList.remove("subTaskHover");
  document.getElementById(id.id).classList.add("inputFieldDesign");
}

function returnInputField(id) {
  return `
    <input class="inputFieldEdit" id="${id.id}_input" type="text" value="${id.id}">
    <img onclick="deleteSubTask(${id.id})" src="./assets/img/delete.svg" alt="">
    <img onclick="deleteSubTask(${id.id})" src="./assets/img/checked_subtask.svg" alt="">
    `;
}

function focusInputField(id) {
  let inputField = document.getElementById(`${id.id}_input`);
  inputField.focus();
  inputField.select();
}

function deleteSubTask(id) {
  let element = document.getElementById(id.id);
  element.remove();
  console.log("LöschenFUnktionierte", id.id);
}

function getRightPriority(element) {
  let containerId = element[1]["id"];
  let taskPriority = element[1]["priority"];
  let lowPriority = "./assets/img/prio_low.svg";
  let mediumPriority = "./assets/img/prio_medium.svg";
  let urgentPriority = "./assets/img/prio_urgent.svg";
  let priorityImg = taskPriority === "low" ? lowPriority : taskPriority === "medium" ? mediumPriority : urgentPriority;
  if (bigTaskActive) {
    containerId = `bigPriority${element[1]["id"]}`;
  } else {
    containerId = `priority${element[1]["id"]}`;
  }
  document.getElementById(containerId).innerHTML = `<img src="${priorityImg}"/>`;
}

function getRightUserColor(element) {
  let colorStory = element[1]["story"];
  let containerId;
  if (bigTaskActive) {
    containerId = `bigStory${element[1]["id"]}`;
  } else {
    containerId = `story${element[1]["id"]}`;
  }
  if (colorStory === "Technical Task") {
    document.getElementById(containerId).style.backgroundColor = "#1fd7c1";
  } else {
    document.getElementById(containerId).style.backgroundColor = "#0038ff";
  }
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
}

function eventStopPropagation(event) {
  event.stopPropagation();
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

function highlightRightPriority(rightTask) {
  let urgentId = document.getElementById("urgent");
  let mediumId = document.getElementById("medium");
  let lowId = document.getElementById("low");
  let backgroundColorPriority = rightTask.priority == "urgent" ? "#f33d00" : rightTask.priority == "medium" ? "#ffa800" : rightTask.priority == "low" ? "#7ae228" : "";
  let priority = rightTask.priority == "urgent" ? urgentId : rightTask.priority == "medium" ? mediumId : rightTask.priority == "low" ? lowId : "";
  priority.style.backgroundColor = backgroundColorPriority;
  priority.style.color = "white";
  svgColors(rightTask);
}

function svgColors(rightTask) {
  let svgId = rightTask.priority == "urgent" ? "svgUrgent" : rightTask.priority == "medium" ? "svgMedium" : rightTask.priority == "low" ? "svgLow" : "";
  let svgContainer = document.getElementById(`${svgId}`);
  svgContainer.removeAttribute("class");
}

function getRightTimeZone(fireBaseDate) {
  const switchDate = fireBaseDate;
  const [fireBaseDay, fireBaseMonth, fireBaseYear] = switchDate.split(".");
  const newDate = `${fireBaseYear}.${fireBaseMonth}.${fireBaseDay}`;
  const rawDate = new Date(newDate); // Datum aus der Datenbank holen
  const year = rawDate.getFullYear();
  const month = String(rawDate.getMonth() + 1).padStart(2, "0"); // Monat +1, weil Monate bei 0 beginnen
  const day = String(rawDate.getDate()).padStart(2, "0"); // Tag formatieren
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

// Sicherung ToDos anlegen
// await postData('/toDos',{headline:'Kochwelt Page & Recipe Recommender', id: 1, category:'done', description:'Build start page with recipe recommendation', assignedTo: {user1: 1, user2: 2, user3: 3}, subtasks:{task1: 1, task2: 2}, priority: 'medium', date: 'Datum', story: {userStory: 'User Story', technicalTask:'Technical Task'}})
// await postData('/toDos/-O8rk7TAjcfN0IUq3qmd/subtasks',{status:true, value: 'duschen'})
