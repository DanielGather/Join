function startDraggin(id, event) {
  currentDraggedElement = id;
  // let ghostImage = new Image(); // Leeres Ghost Image erstellen
  // event.dataTransfer.setDragImage(ghostImage, 0, 0);
  // document.getElementById(id).style.opacity = "1";
  // document.getElementById(id).style.backgroundColor = "Blue";
  document.getElementById(id).style.transform = "rotate(15deg)";
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
