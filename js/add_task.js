let subtaskArray = [];

function handleSubmit(event) {   // prüfen welcher button geklickt wurde
    event.preventDefault();
    const submitButton = event.submitter;    
    if (submitButton.id === "clear") {
        clear(); 
    } else if (submitButton.id === "createTask") {
        createTask(); 
    }   
    return false;
}


function clear() {
    console.log("clear test test"); 
}


async function createTask() {
    console.log("createTask test test");
    let newAddTask ;
}


function toggleAssignedToDropDown() {
    let imgDropdownToggle = document.getElementById('imgDropdownToggle');
    let dropdownMenu = document.getElementById('dropDownMenu');
    if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'flex';
        imgDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    } else {
        dropdownMenu.style.display = 'none';
        imgDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    }
}


function toggleCategoryDropDown() {
    let imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    let categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    if (categoryDropdownMenu.style.display === 'none') {
        categoryDropdownMenu.style.display = 'flex';
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    }else {
        categoryDropdownMenu.style.display = 'none';
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    }
}


function setCategory(category) {
    document.getElementById('category-header').innerText = category;
    categoryDropdownMenu.style.display = 'none';
    imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
}


function addSubTask() {
    document.getElementById('rendered-task-container').style = 'opacity:1';
    let subtaskInput = document.getElementById('subtasks-input').value;
    subtaskArray.push(subtaskInput);
    let taskContainer = document.getElementById('rendered-task-container');
    taskContainer.innerHTML = '';
    for (let i = 0; i < subtaskArray.length; i++){
        let subtask = subtaskArray[i];
        taskContainer.innerHTML += `
        <ul class="subtaskList">
            <li>${subtask}</li>
        </ul>
        `
    }
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
}


function toggleSubtaskIcons() {
    let plusIcon = document.getElementById('plusIcon');
    let actionIcons = document.getElementById('actionIcons');
    if(plusIcon.style.display === 'none') {
        plusIcon.style.display = 'block';
        actionIcons.style.display = 'none';
    } else {
        plusIcon.style.display = 'none';
        actionIcons.style.display = 'flex';
    }
}


function deleteInputSubtaskValue() {
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
}