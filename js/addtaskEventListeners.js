document.addEventListener('DOMContentLoaded', function () {
    initializeEventListenerKeydownSubtaskInput();
    initializeEventListenerKeydownTitleInput();
    initializeEventListenerInputTitle();
    initializeEventListenerChangeDate();
});


function initializeEventListenerInputTitle() {
    const addTaskTitle = document.getElementById('addTaskTitle');
    if (addTaskTitle) {
        addTaskTitle.addEventListener('input', checkIfCreateTaskButtonCanBeEnabled);
    }
}


function initializeEventListenerChangeDate() {
    const inputDate = document.getElementById('inputDate');
    if (inputDate) {
        inputDate.addEventListener('change', checkIfCreateTaskButtonCanBeEnabled);
    }
}


function initializeEventListenerKeydownSubtaskInput() {
    const subtasksInput = document.getElementById('subtasks-input');
    if (subtasksInput) {
        subtasksInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addSubTask();
            }
        });
    }
}


function initializeEventListenerKeydownTitleInput() {
    const addTaskTitle = document.getElementById('addTaskTitle');
    if (addTaskTitle) {
        addTaskTitle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        let dropdownMenu = document.getElementById('dropDownMenu');
        let imgDropdownToggle = document.getElementById('imgDropdownToggle');
        let mainContainer = document.getElementById('main');
        if (dropdownMenu && imgDropdownToggle && mainContainer) {
            if (!dropdownMenu.classList.contains('d-none')) {
                if (mainContainer.contains(event.target) && 
                    !dropdownMenu.contains(event.target) && 
                    !imgDropdownToggle.contains(event.target)) {                    
                    dropdownMenu.classList.add('d-none');
                    imgDropdownToggle.src = './assets/img/arrow_drop_down.svg';
                }
            }
        }
    });
}); 