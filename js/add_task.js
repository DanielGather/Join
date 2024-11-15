let subtaskArray = [];
//let choosedContact = [];
let statusPriority = 'medium';
let selectedCategory = null;
let assignedToContacts = null;
let allCurrentIds = [];
let checkedContactNames = [];
let checkedContactInitials = [];
let checkedContactColors = [];


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
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('textForDescription').value = '';
    document.getElementById('inputDate').value = '';
    document.getElementById('subtasks-input').value = '';
    priority = null;
    setButtonColorForPrio(null);
    document.getElementById('category-header').innerText = 'Select task category';
    selectedCategory = null;
    document.getElementById('dropDownMenu').innerHTML = '';
    document.getElementById('renderedInitialsContainer').innerHTML = '';
    document.getElementById('rendered-task-container').innerHTML = '';
    document.getElementById('rendered-task-container').style.opacity = '0';
    subtaskArray = [];
    //choosedContact = [];
}


async function createTask() {
    await getAllToDos();
    console.log("createTask test test");
    let idNum = createNewId();
    let newTask = getInputValues(idNum);
    const taskId = (await postData('toDos', newTask)).name;
    console.log('taskId lautet:', taskId);
    if (subtaskArray.length > 0) {
        for (let i = 0; i < subtaskArray.length; i++) {
            let subtask = {
                status: false,
                task: subtaskArray[i],
            };
            const subtaskId = await postData(`toDos/${taskId}/subtasks`, subtask);
            console.log('Subtask-ID lautet:', subtaskId.name);
        }
    };
    console.log('neue Task:', newTask);
    showAddTaskSuccessPopup();
}


function getInputValues(idNum) {
    let title = getTitle();
    let description = getDescription();
    let dueDate = getDueDate();
    let priority = statusPriority;
    let category = selectedCategory;
    let assignedTo = assignedToContacts;
    let toDoId = idNum;
    return {
        'headline': title,
        'date': dueDate,
        'priority': priority,
        'story': category,
        'description': description,
        'assignedTo': assignedTo,
        //'subtasks': subTasks,
        'id': toDoId,
        'category': 'toDo',
    };
}


async function getAllToDos() {
    let data = await getData("toDos");
    let allCurrentToDos = Object.values(data);
    console.log('alle Todos:', allCurrentToDos);
    for (let i = 0; i < allCurrentToDos.length; i++) {
        let singleId = allCurrentToDos[i].id;
        allCurrentIds.push(singleId);
    }
    console.log('alle Ids:', allCurrentIds);
}


function createNewId() {
    if(allCurrentIds.length === 0){
        return 1;
    }
    let maxId = Math.max(...allCurrentIds);
    return maxId + 1;
}


function getTitle() {
    let title = document.getElementById('addTaskTitle').value.trim();
    return title;
}


function getDescription() {
    let description = document.getElementById('textForDescription').value;
    return description;
}


function getDueDate() {
    let dueDate = document.getElementById('inputDate').value;
    dueDate = changeTimeFormat(dueDate);
    return dueDate
}


function chooseTaskPrioType(priorityType) {
    if (statusPriority === priorityType) {
        setButtonColorForPrio(null);
        statusPriority = null;
        console.log('Prioauswahl deaktiviert:', statusPriority);
        return null;
    }
    statusPriority = priorityType;
    setButtonColorForPrio(priorityType);
    console.log('Prioauswahl:', statusPriority);
    //return statusPriority;
}


function setButtonColorForPrio(priorityType) {
    resetButtonStyles();
    if (priorityType === null) {
        priorityType = 'medium'; // Standard auf 'medium' setzen, wenn null
    }
    if (priorityType === "urgent") {
        document.getElementById("urgentButton").style.backgroundColor = '#FF3D19';
        document.getElementById("urgentButton").style.color = 'white';
        document.getElementById("urgentButtonImg").src = './assets/img/prio-urgent-white.svg';
    } else if (priorityType === "medium") {
        document.getElementById("mediumButton").style.backgroundColor = '#FFA827';
        document.getElementById("mediumButton").style.color = 'white';
        document.getElementById("mediumButtonImg").src = './assets/img/prio-medium-white.svg';
    } else if (priorityType === "low") {
        document.getElementById("lowButton").style.backgroundColor = '#7AE22B';
        document.getElementById("lowButton").style.color = 'white';
        document.getElementById("lowButtonImg").src = './assets/img/prio-low-white.svg';
    }
}


function resetButtonStyles() { 
    document.getElementById("urgentButton").style.backgroundColor = '';
    document.getElementById("urgentButton").style.color = '';
    document.getElementById("urgentButtonImg").src = './assets/img/prio_urgent.svg';
    document.getElementById("mediumButton").style.backgroundColor = '';
    document.getElementById("mediumButton").style.color = '';
    document.getElementById("mediumButtonImg").src = './assets/img/prio_medium.svg';
    document.getElementById("lowButton").style.backgroundColor = '';
    document.getElementById("lowButton").style.color = '';
    document.getElementById("lowButtonImg").src = './assets/img/prio_low.svg';
}


async function toggleAssignedToDropDown(trueOrFalse) {
    renderAssignedToContacts(trueOrFalse);
    
    let imgDropdownToggle = document.getElementById('imgDropdownToggle');
    let dropdownMenu = document.getElementById('dropDownMenu');
    dropdownMenu.classList.toggle('d-none');
    if (dropdownMenu.classList.contains('d-none')) {
        imgDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    } else {
        imgDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    }
}


function toggleCategoryDropDown() {
    let imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    let categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    categoryDropdownMenu.classList.toggle('d-none');
    if (categoryDropdownMenu.classList.contains('d-none')) {
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    } else {
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    }
}


function setCategory(category) {
    let categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    let imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    document.getElementById('category-header').innerText = category;
    //categoryDropdownMenu.style.display = 'none';
    categoryDropdownMenu.classList.add('d-none');
    imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    selectedCategory = category;
    console.log('category ist:', selectedCategory);
    //return selectedCategory;
}

/*
function addSubTask() {
    document.getElementById('rendered-task-container').style = 'opacity:1';
    let subtaskInput = document.getElementById('subtasks-input').value.trim();
    if (subtaskInput) {
        subtaskArray.push({ task: subtaskInput });
        let taskContainer = document.getElementById('rendered-task-container');
        taskContainer.innerHTML = '';
        for (let i = 0; i < subtaskArray.length; i++) {
            let subtask = subtaskArray[i].task;
            taskContainer.innerHTML += `
        <ul class="subtaskList">
            <li>${subtask}</li>
        </ul>
        `
        }
    }
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
    console.log('subtaskArray:', subtaskArray);
}*/


function addSubTask() {
    //let newSubtask = {};
    document.getElementById('rendered-task-container').style = 'opacity:1';
    let subtaskInput = document.getElementById('subtasks-input').value.trim();
    if (subtaskInput) {
        subtaskArray.push(subtaskInput);
        renderSubtasks();
    }
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
    console.log('subtaskArray:', subtaskArray);
}


function renderSubtasks() {
    let taskContainer = document.getElementById('rendered-task-container');
    taskContainer.innerHTML = '';
    for (let i = 0; i < subtaskArray.length; i++) {
        let subtask = subtaskArray[i];
        taskContainer.innerHTML += `
        <div class="subtask-single-container" id="subtask-List-Container-${i}">
            <ul class="subtaskList" >
                <li id="subtaskText-${i}">${subtask}</li>
                <div class="subtask-icon-container">
                    <img src="./assets/img/subtask_pencil.svg" alt="pencil" onclick="editSubtask(${i})">
                    <div class="subtask-separator"></div>
                    <img src="./assets/img/delete.svg" alt="delete" onclick="deleteSubtask(${i})">
                </div>
            </ul>
        </div>
    `;
    }
}


function editSubtask(index) {
    let subtaskElementContainer = document.getElementById(`subtask-List-Container-${index}`);
    subtaskElementContainer.innerHTML = `
        <div class="subtask-edit-container">
            <input type="text" id="editInput-${index}" value="${subtaskArray[index]}">
            <div class="editSubtask-icon-container">
                <img src="./assets/img/delete.svg" alt="delete" onclick="cancelEditSubtask()">
                <div class="subtask-separator"></div>
                <img src="./assets/img/addtask_check.svg" alt="checkIcon" onclick="saveEditSubtask(${index})">
            </div>  
        </div>
    `;
}


function saveEditSubtask(index) {
    let editedSubtaskValue = document.getElementById(`editInput-${index}`).value.trim();
    if (editedSubtaskValue) {
        subtaskArray[index] = editedSubtaskValue;
        renderSubtasks();
    }
}


function cancelEditSubtask() {
    renderSubtasks();
}


function deleteSubtask(index) {
    subtaskArray.splice(index, 1);
    renderSubtasks();
}


function toggleSubtaskIcons() {
    let plusIcon = document.getElementById('plusIcon');
    let actionIcons = document.getElementById('actionIcons');
    if (plusIcon.style.display === 'none') {
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


function renderInitials(trueOrFalse) {
    console.log("Teste True or False ", trueOrFalse);

    checkedContactNames = [];
    checkedContactInitials = [];
    checkedContactColors = [];

    //let checkedContacts = {};
    assignedToContacts = getCheckedContacts();
    //let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    //renderedInitialsContainer.innerHTML = '';
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
            //let key = checkedContact[0].name;
            //let value = checkedContact[0].initials;
            //checkedContacts[key] = value;
            //assignedToContacts = checkedContacts;
            let name = checkedContact[0].name;
            let initial = checkedContact[0].initials;
            let color = checkedContact[0].color;
            checkedContactNames.push(name);
            checkedContactInitials.push(initial);
            checkedContactColors.push(color);
            //renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(checkedContact);
        }
    })

    let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    renderedInitialsContainer.innerHTML = ''; 
    checkedContactInitials.forEach((initial, index) => {
        let color = checkedContactColors[index]; 
        renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(initial, color);
    });
    //console.log('assigned to:', checkedContacts);
    console.log('die checkContactnames:', checkedContactNames);
    console.log('die checkContactinitials:', checkedContactInitials);
    console.log('die checkContactcolor:', checkedContactColors);
    
    renderAssignedToContacts(trueOrFalse);
}


function getCheckedContacts() {
    let checkedContacts = {};
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    let counter = 1;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
            //let key = checkedContact[0].name;
            //let value = checkedContact[0].initials;
            //let value = checkedContact[0].name;
            //let value = checkedContact[0].name;
            //let key = checkedContact[0].email;
            let key = 'userEmail' + counter;
            let value = checkedContact[0].email;
            checkedContacts[key] = value;
            counter++;
        }
    });
    console.log('assigned to:', checkedContacts);
    return checkedContacts;
}

/*
function renderAssignedToContacts(trueOrFalse) {
    document.getElementById('dropDownMenu').innerHTML = '';
    for (let i = 0; i < contactsOnly.length; i++) {
        let contact = contactsOnly[i];
        document.getElementById('dropDownMenu').innerHTML += temp_generateHtmlAssignedToContacts(contact, trueOrFalse);
        //console.log('name und initials:', contact.name, contact.initial);
    }
}*/

function renderAssignedToContacts(trueOrFalse) {
    let dropDownMenu = document.getElementById('dropDownMenu');
    dropDownMenu.innerHTML = '';
    checkedContactNames.forEach(name => {
        let contact = contactsOnly.find(contact => contact.name === name);
        if (contact) {
            dropDownMenu.innerHTML += temp_generateHtmlAssignedToContacts(contact, trueOrFalse);
        }
    });
    contactsOnly.forEach(contact => {
        if (!checkedContactNames.includes(contact.name)) {
            dropDownMenu.innerHTML += temp_generateHtmlAssignedToContacts(contact, trueOrFalse);
        }
    });
    updateCheckboxStatus();
}


function updateCheckboxStatus() {
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkedContactNames.includes(contactsOnly.find(contact => contact.email === checkbox.id).name)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}


function showAddTaskSuccessPopup() {
    let animatedContainer = document.getElementById('popup-addTask-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
        window.location.href = 'board.html';
    }, 2000);
}


document.addEventListener('DOMContentLoaded', function() {
    const subtasksInput = document.getElementById('subtasks-input');
    if (subtasksInput) {
        subtasksInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('Enter-Taste von addsubmit wurde gedrückt');
                addSubTask();
            }
        });
    }

    const addTaskTitle = document.getElementById('addTaskTitle');
    if (addTaskTitle) {
        addTaskTitle.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('enter taste test test test');
            }
        });
    }
});
