/**
 * Starts the drag action for an element, changing its style and cursor to indicate movement.
 * This function is triggered when the user begins to drag an element.
 * @param {string} id - The ID of the element being dragged.
 * @param {Event} event - The event object associated with the drag action, typically a mouse or touch event.
 */
function startDraggin(id, event) {
  currentDraggedElement = id;
    event.target.style.transform = 'rotate(5deg)';
    event.target.style.cursor = "move";
}

/**
 * Prevents the default handling of a drag-and-drop event, allowing the drop action to occur.
 * This function is typically used to enable an element to accept a dragged item.
 * @param {Event} ev - The event object associated with the drag-and-drop operation.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a specified category by updating the category in the database
 * and re-rendering the task board. This function fetches the task ID, updates
 * the category in the database, and refreshes the board and HTML content.
 * @param {string} category - The name of the category to move the task to.
 */
async function moveToCategory(category) {
  let id = await getIdFromDb("/toDos", "id", currentDraggedElement);
  await putData("/toDos/" + id + "/category", category);
  renderBoard();
  await updateHTML();
}

/**
 * Highlights an element by adding a specific CSS class to it, indicating that it is 
 * a drag area or a special target for interaction.
 * @param {string} id - The ID of the element to be highlighted.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from an element by removing the specific CSS class,
 * indicating that it is no longer a highlighted target area.
 * @param {string} id - The ID of the element from which the highlight class should be removed.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Stops the rotation by calling the `updateHTML` function to refresh or update
 * the HTML content. This function is typically used to stop any ongoing rotation 
 * effect or animation.
 */
function stopRotation(){
  updateHTML();
}
