function startDraggin(id, event) {
  currentDraggedElement = id;
    event.target.style.transform = 'rotate(5deg)';
    event.target.style.cursor = "move";
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveToCategory(category) {
  let id = await getIdFromDb("/toDos", "id", currentDraggedElement);
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

function stopRotation(){
  updateHTML();
}
