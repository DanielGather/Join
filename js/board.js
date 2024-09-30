let currentDraggedElement;

function boardJS() {
  renderBoard();
  navbarTemplate();
  renderToDo();
}

function renderBoard() {
  let htmlContent = document.getElementById("main");
  let headerContent = document.getElementById("header");
  htmlContent.innerHTML = boardHtml();
  headerContent.innerHTML = returnHeaderHtml();
}

function renderToDo() {
  let htmlToDo = document.getElementById("toDo");
  htmlToDo.innerHTML = "";
  htmlToDo.innerHTML = htmlTechnicalTaskSmall();
}

function startDraggin(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]["category"] = category;
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}
