let subtaskArray = [];
let choosedContact = [];
let statusPriority = null;
let selectedCategory = null;
let assignedToContacts = null;
let allCurrentIds = [];


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
    choosedContact = [];
}


async function createTask() {
    await getAllToDos();
    console.log("createTask test test");
    let idNum = createNewId();
    let newTask = getInputValues(idNum);
    //postData('toDos', newTask);
    const taskId = (await postData('toDos', newTask)).name;
    console.log('taskId lautet:', taskId);
    if (subtaskArray.length > 0) {
        for (let i = 0; i < subtaskArray.length; i++) {
            let subtask = {
                status : false,
                task: subtaskArray[i],
            };
            const subtaskId = await postData(`toDos/${taskId}/subtasks`, subtask);
            console.log('Subtask-ID lautet:', subtaskId.name); 
        }
    }
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
    //let subTasks = subtaskArray;
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
    for (let i = 0; i < allCurrentToDos.length; i++){
        let singleId = allCurrentToDos[i].id;
        allCurrentIds.push(singleId);
    }
    console.log('alle Ids:', allCurrentIds);
  }


function createNewId() {
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
    document.getElementById("urgentButton").style.backgroundColor = '';
    document.getElementById("mediumButton").style.backgroundColor = '';
    document.getElementById("lowButton").style.backgroundColor = '';
    if (priorityType === "Urgent") {
        document.getElementById("urgentButton").style.backgroundColor = '#FF3D19';
    } else if (priorityType === "Medium") {
        document.getElementById("mediumButton").style.backgroundColor = '#FFA827';
    } else if (priorityType === "Low") {
        document.getElementById("lowButton").style.backgroundColor = '#7AE22B';
    }
}


function toggleAssignedToDropDown() {
    renderAssignedToContacts();
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
    } else {
        categoryDropdownMenu.style.display = 'none';
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    }
}


function setCategory(category) {
    document.getElementById('category-header').innerText = category;
    categoryDropdownMenu.style.display = 'none';
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
        let taskContainer = document.getElementById('rendered-task-container');
        taskContainer.innerHTML = '';
        //let task = 'task';
        for (let i = 0; i < subtaskArray.length; i++) {
            let subtask = subtaskArray[i];
            //let newSubtask = {};
            //newSubtask[task] = subtask;
            //postData('toDos/subtasks', newSubtask);
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
    //let checkedContacts = [];
    let checkedContacts = {};
    let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    renderedInitialsContainer.innerHTML = '';
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
            let key = checkedContact[0].name;
            let value = checkedContact[0].initials;
            //let newObject = { [key]: value };
            //checkedContacts.push(newObject);
            checkedContacts[key] = value;
            assignedToContacts = checkedContacts;  
            renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(checkedContact);
        }
    })
    console.log('assigned to:', checkedContacts);
    //return checkedContacts;
}


function renderAssignedToContacts() {
    document.getElementById('dropDownMenu').innerHTML = '';
    for (let i = 0; i < contactsOnly.length; i++) {
        let contact = contactsOnly[i];
        document.getElementById('dropDownMenu').innerHTML += temp_generateHtmlAssignedToContacts(contact);
        //console.log('name und initials:', contact.name, contact.initial);
    }
}


function showAddTaskSuccessPopup() {
    let animatedContainer = document.getElementById('popup-addTask-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
        window.location.href = 'board.html';
    }, 2000);
}