/**
 * Displays a success popup when a task has been successfully added.
 * 
 * This function adds a 'visible' class to the popup container, making it visible to the user.
 * After a delay of 2 seconds, the 'visible' class is removed, and the user is redirected to the 
 * `board.html` page, indicating that the task has been successfully created and the user is 
 * being taken to the task board.
 * 
 * @returns {void} This function does not return a value. It modifies the DOM elements
 * and redirects the user after a timeout.
 */
function showAddTaskSuccessPopup() {
    let animatedContainer = document.getElementById('popup-addTask-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
        window.location.href = 'board.html';
    }, 2000);
}