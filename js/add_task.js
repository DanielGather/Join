let subtaskArray = [];
let choosedContact = [];
let priority = null;
let selectedCategory = null;
let idNum = 0;


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
    //await updateLS();
    console.log("createTask test test");
    idNum++; 
    let newTask = getInputValues();
    console.log('neue Task:', newTask);
    //postData('toDos', newTask);

}


function getInputValues() {
    let title = getTitle();
    let description = getDescription();
    let dueDate = getDueDate();
    let priority = chooseTaskPrioType();
    let category = setCategory();
    let assignedTo = renderInitials();
    let subTasks = addSubTask();
    //return subTasks;
    return {
        'headline': title,
        'date': dueDate,
        'priority': priority,
        'story': category,
        'description': description,
        'assignedTo': assignedTo,
        'subtasks': subTasks,
        'id': idNum,
    };
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


/*
function taskAssignedToContact() {
    // Task an Kontakt zuweisen
}*/


function chooseTaskPrioType(priorityType) {
    if (priority === priorityType){
        setButtonColorForPrio(null);
        priority = null;
        console.log('Prioauswahl deaktiviert:', priority);
        return null;
    }
    priority = priorityType;
    setButtonColorForPrio(priorityType);
    console.log('Prioauswahl:', priority);
    return priority;
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


/*
function getSubtasks() {
    //subtask holen
}*/


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
    return selectedCategory;
}


function addSubTask() {
    let allSubtasks = [];
    document.getElementById('rendered-task-container').style = 'opacity:1';
    let subtaskInput = document.getElementById('subtasks-input').value;
    subtaskArray.push(subtaskInput);
    let taskContainer = document.getElementById('rendered-task-container');
    taskContainer.innerHTML = '';
    for (let i = 0; i < subtaskArray.length; i++) {
        let subtask = subtaskArray[i];
        let newSingleTaskObject = { task: subtask };
        allSubtasks.push(newSingleTaskObject);
        taskContainer.innerHTML += `
        <ul class="subtaskList">
            <li>${subtask}</li>
        </ul>
        `
    }
    document.getElementById('subtasks-input').value = '';
    document.getElementById('actionIcons').style = 'display:none';
    document.getElementById('plusIcon').style = 'display:block';
    console.log('allSubtasks:', allSubtasks);
    return allSubtasks;
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
    let checkedContacts = [];
    let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    renderedInitialsContainer.innerHTML = '';
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
            //console.log('checked Contact:', checkedContact);
            
            let key = checkedContact[0].name;
            let value = checkedContact[0].initials;
            let newObject = { [key]: value };
            checkedContacts.push(newObject);

            console.log(checkedContacts);
            renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(checkedContact);
        }
    })
    return checkedContacts;
}


function renderAssignedToContacts() {
    document.getElementById('dropDownMenu').innerHTML = '';
    for (let i = 0; i < contactsOnly.length; i++) {
        let contact = contactsOnly[i];
        document.getElementById('dropDownMenu').innerHTML += temp_generateHtmlAssignedToContacts(contact);
        //console.log('name und initials:', contact.name, contact.initial);
    }
}