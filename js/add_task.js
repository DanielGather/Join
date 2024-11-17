let subtaskArray = [];
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
    setButtonColorForPrio(null,"AddTask");
    document.getElementById('category-header').innerText = 'Select task category';
    selectedCategory = null;
    document.getElementById('dropDownMenu').innerHTML = '';
    document.getElementById('renderedInitialsContainer').innerHTML = '';
    document.getElementById('rendered-task-container').innerHTML = '';
    document.getElementById('rendered-task-container').style.opacity = '0';
    subtaskArray = [];
    resetCheckboxes();
}


function resetCheckboxes() {
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    checkedContactNames = [];
    checkedContactInitials = [];
    checkedContactColors = [];
    assignedToContacts = null;
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
        'id': toDoId,
        'category': 'toDo',
    };
}


async function getAllToDos() {
    let data = await getData("toDos");
    if(!data){
        console.warn('data not avaiable or path doesnt exist ')
        allCurrentIds = [1];
        return;
    }
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


/**
 * the function gets the value from the input element with the ID 'addTaskTitle',
 * trims any leading and trailing whitespace, and returns the cleaned title.
 * @returns {string} The trimmed title from the input field.
 */
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


function chooseTaskPrioType(priorityType, idVariable) {
    if (statusPriority === priorityType) {
        setButtonColorForPrio(null, idVariable);
        statusPriority = null;
        console.log('Prioauswahl deaktiviert:', statusPriority);
        return null;
    }
    statusPriority = priorityType;
    setButtonColorForPrio(priorityType, idVariable);
    console.log('Prioauswahl:', statusPriority);
}


function setButtonColorForPrio(priorityType, idVariable) {
    resetButtonStyles(idVariable);
    if (priorityType === null) {
        priorityType = 'medium';
    }
    if (priorityType === "urgent") {
        document.getElementById(`urgentButton${idVariable}`).style.backgroundColor = '#FF3D19';
        document.getElementById(`urgentButton${idVariable}`).style.color = 'white';
        document.getElementById(`urgentButtonImg${idVariable}`).src = './assets/img/prio-urgent-white.svg';
    } else if (priorityType === "medium") {
        document.getElementById(`mediumButton${idVariable}`).style.backgroundColor = '#FFA827';
        document.getElementById(`mediumButton${idVariable}`).style.color = 'white';
        document.getElementById(`mediumButtonImg${idVariable}`).src = './assets/img/prio-medium-white.svg';
    } else if (priorityType === "low") {
        document.getElementById(`lowButton${idVariable}`).style.backgroundColor = '#7AE22B';
        document.getElementById(`lowButton${idVariable}`).style.color = 'white';
        document.getElementById(`lowButtonImg${idVariable}`).src = './assets/img/prio-low-white.svg';
    }
}


function resetButtonStyles(idVariable) { 
    document.getElementById(`urgentButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`urgentButton${idVariable}`).style.color = '';
    document.getElementById(`urgentButtonImg${idVariable}`).src = './assets/img/prio_urgent.svg';
    document.getElementById(`mediumButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`mediumButton${idVariable}`).style.color = '';
    document.getElementById(`mediumButtonImg${idVariable}`).src = './assets/img/prio_medium.svg';
    document.getElementById(`lowButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`lowButton${idVariable}`).style.color = '';
    document.getElementById(`lowButtonImg${idVariable}`).src = './assets/img/prio_low.svg';
}


async function toggleAssignedToDropDown() {
    renderAssignedToContacts();
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
    categoryDropdownMenu.classList.add('d-none');
    imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    selectedCategory = category;
    console.log('category ist:', selectedCategory);
}


function addSubTask() {
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
        taskContainer.innerHTML += temp_generateHtmlRenderSubtasks(subtask, i);
    }
}


function editSubtask(index) {
    let subtaskElementContainer = document.getElementById(`subtask-List-Container-${index}`);
    subtaskElementContainer.innerHTML = temp_generateHtmlEditSubtasks(index);
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


function renderInitials() {
    console.log("Teste True or False ", );
    checkedContactNames = [];
    checkedContactInitials = [];
    checkedContactColors = [];
    assignedToContacts = getCheckedContacts();
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
            let name = checkedContact[0].name;
            let initial = checkedContact[0].initials;
            let color = checkedContact[0].color;
            checkedContactNames.push(name);
            checkedContactInitials.push(initial);
            checkedContactColors.push(color);
        }
    })
    let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    renderedInitialsContainer.innerHTML = ''; 
    checkedContactInitials.forEach((initial, index) => {
        let color = checkedContactColors[index]; 
        renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(initial, color);
    });
    console.log('die checkContactnames:', checkedContactNames);
    console.log('die checkContactinitials:', checkedContactInitials);
    console.log('die checkContactcolor:', checkedContactColors);
    renderAssignedToContacts();
}


function getCheckedContacts() {
    let checkedContacts = {};
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    let counter = 1;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
            let key = 'userEmail' + counter;
            let value = checkedContact[0].email;
            checkedContacts[key] = value;
            counter++;
        }
    });
    console.log('assigned to:', checkedContacts);
    return checkedContacts;
}


function renderAssignedToContacts() {
    let dropDownMenu = document.getElementById('dropDownMenu');
    dropDownMenu.innerHTML = '';
    checkedContactNames.forEach(name => {
        let contact = contactsOnly.find(contact => contact.name === name);
        if (contact) {
            dropDownMenu.innerHTML += temp_generateHtmlAssignedToContacts(contact );
        }
    });
    contactsOnly.forEach(contact => {
        if (!checkedContactNames.includes(contact.name)) {
            dropDownMenu.innerHTML += temp_generateHtmlAssignedToContacts(contact);
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
