let currentDraggedElement;
let allToDos;
let searchedTask = [];

function boardJS() {
  renderBoard();
  navbarTemplate();
  updateHTML();
}

// TODO: SubTask berechnung durchführen für die Progressbar.
// TODO: Such Funktion weiter anpassen. Funktion schreiben das immer das richtige array genommen wird. Wenn inputFled leer ist sollen wieder alles Tasks gerendert werden.
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

function getRightUserColor(element) {
  let colorStory = element[1]["story"];
  let containerId = element[1]["id"];
  if (colorStory === "Technical Task") {
    document.getElementById(`story${containerId}`).style.backgroundColor = "#1fd7c1";
  }
}

function getRightPriority(element) {
  let containerId = element[1]["id"];
  let taskPriority = element[1]["priority"];
  let lowPriority = "./assets/img/prio_low.svg";
  let mediumPriority = "./assets/img/prio_medium.svg";
  let urgentPriority = "./assets/img/prio_urgent.svg";
  let priorityImg = taskPriority === "low" ? lowPriority : taskPriority === "medium" ? mediumPriority : urgentPriority;
  document.getElementById(`priority${containerId}`).innerHTML = `<img src="${priorityImg}"/>`;
}

// function clearTaskContainer(){
//   document.getElementById('awaitFeedback').innerHTML = "";
//   document.getElementById('toDo').innerHTML = "";
//   document.getElementById('inProgress').innerHTML = "";
//   document.getElementById('done').innerHTML = "";
// }


function getRightArray(allToDos){
  if(searchedTask.length > 0){
    let toDoArray = searchedTask
    return toDoArray
  } else {
    let toDoArray = allToDos
    return toDoArray;
  }
}


function updateCategoryHTML(category, containerId, allToDos) {
  let  toDoArray = getRightArray(allToDos);
  let filteredToDos = toDoArray.filter((t) => t[1]["category"] === category);
  if (filteredToDos.length === 0) return;
  document.getElementById(containerId).innerHTML = "";
  filteredToDos.forEach((element) => {
    document.getElementById(containerId).innerHTML += htmlTechnicalTaskSmall(element);
    let assignedToKeys = Object.entries(element[1]["assignedTo"] || {});
    assignedToKeys.forEach(([key, value]) => {
      document.getElementById(`assignedTo${element[1]["id"]}`).innerHTML += /*HTML*/ `
        <div class="smallCircleUserStory">
          ${value}
        </div>
      `;
    });
    getRightUserColor(element);
    getRightPriority(element);
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
  console.log("test",id);
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
  let input = checkInput(id);
  if (input.length >= 3){
    searchRightTask(input);
    updateHTML();
  } else if(input.length == 0) {
    searchedTask = [];
    updateHTML();
  }
}

function searchRightTask(input){
  searchedTask = [];
  let filteredTasks = allToDos.filter(task  => 
    task[1]['headline'].toLowerCase().includes(input)  || 
    task[1]['description'].toLowerCase().includes(input)
  );
  console.log("Checken was gepush wird", filteredTasks[0]);
  filteredTasks.forEach((element) => searchedTask.push(element));
  console.log("Funktioniert", searchedTask);
}

function openTask(id){
  console.log("id test", id);
  
  document.getElementById("bigTask").style.display =  "flex";
  document.getElementById("bigTask").innerHTML = technicalTaskBig();
  console.log("Öffnet");
}

function closeBigTask(){
  document.getElementById("bigTask").style.display =  "none";
}

function eventStopPropagation(event) {
  event.stopPropagation();
}
// Sicherung ToDos anlegen
// await postData('/toDos',{headline:'Kochwelt Page & Recipe Recommender', id: 1, category:'done', description:'Build start page with recipe recommendation', assignedTo: {user1: 1, user2: 2, user3: 3}, subtasks:{task1: 1, task2: 2}, priority: 'medium', date: 'Datum', story: {userStory: 'User Story', technicalTask:'Technical Task'}})
