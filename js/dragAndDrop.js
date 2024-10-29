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