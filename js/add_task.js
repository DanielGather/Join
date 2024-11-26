let subtaskArray = [];
let statusPriority = 'medium';
let selectedCategory = null;
let assignedToContacts = null;
let allCurrentIds = [];
let checkedContactNames = [];
let checkedContactInitials = [];
let checkedContactColors = [];


function handleSubmit(event, type) {   // prüfen welcher button geklickt wurde
    event.preventDefault();
    const submitButton = event.submitter;
    if (submitButton.id === "clear") {
        clear();
    } else if (submitButton.id === "createTask") {
        createTask(type);
    }
    return false;
}


async function createTask(type) {
    await getAllToDos();
    let idNum = createNewId();
    let newTask = getInputValues(idNum, type);
    const taskId = (await postData('toDos', newTask)).name;
    if (subtaskArray.length > 0) {
        for (let i = 0; i < subtaskArray.length; i++) {
            let subtask = {
                status: false,
                task: subtaskArray[i],
            };
            const subtaskId = await postData(`toDos/${taskId}/subtasks`, subtask);
        }
    };
    showAddTaskSuccessPopup();
}


function getInputValues(idNum, type) {
    let title = getTitle();
    let description = getDescription();
    let dueDate = getDueDate();
    let priority = statusPriority;
    let category = selectedCategory;
    let assignedTo = assignedToContacts;
    let toDoId = idNum;
    return createInputObject(title, description, dueDate, priority, category, assignedTo, toDoId, type);
}


function createInputObject(title, description, dueDate, priority, category, assignedTo, toDoId, type) {
    return {
        'headline': title,
        'date': dueDate,
        'priority': priority,
        'story': category,
        'description': description,
        'assignedTo': assignedTo,
        'id': toDoId,
        'category': type,
    };
}


async function getAllToDos() {
    let data = await getData("toDos");
    if (!data) {
        console.warn('data not avaiable or path doesnt exist ')
        allCurrentIds = [1];
        return;
    }
    let allCurrentToDos = Object.values(data);
    for (let i = 0; i < allCurrentToDos.length; i++) {
        let singleId = allCurrentToDos[i].id;
        allCurrentIds.push(singleId);
    }
}


function createNewId() {
    if (allCurrentIds.length === 0) {
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


function checkIfCreateTaskButtonCanBeEnabled() {
    const titleInput = document.getElementById("addTaskTitle");
    const dateInput = document.getElementById("inputDate");
    const isTitleFilled = titleInput && titleInput.value.trim() !== "";
    const isDateFilled = dateInput && dateInput.value.trim() !== "";
    const isCategorySelected = selectedCategory !== null;
    const createTaskButton = document.getElementById("createTask");
    if (isTitleFilled && isDateFilled && isCategorySelected) {
        createTaskButton.disabled = false;
    } else {
        createTaskButton.disabled = true;
    }
}


function renderInitials() {
    checkedContactNames = [];
    checkedContactInitials = [];
    checkedContactColors = [];
    assignedToContacts = getCheckedContacts();
    let checkboxes = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            processCheckedContact(checkbox);
        }
    })
    updateRenderedInitials(checkedContactInitials, checkedContactColors);
    renderAssignedToContacts();
}


function processCheckedContact(checkbox) {
    let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
    let name = checkedContact[0].name;
    let initial = checkedContact[0].initials;
    let color = checkedContact[0].color;
    checkedContactNames.push(name);
    checkedContactInitials.push(initial);
    checkedContactColors.push(color);
}


function updateRenderedInitials(checkedContactInitials, checkedContactColors) {
    let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    renderedInitialsContainer.innerHTML = '';
    checkedContactInitials.forEach((initial, index) => {
        let color = checkedContactColors[index];
        renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(initial, color);
    });
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
    return checkedContacts;
}


function renderAssignedToContacts() {
    let dropDownMenu = document.getElementById('dropDownMenu');
    dropDownMenu.innerHTML = '';
    checkedContactNames.forEach(name => {
        let contact = contactsOnly.find(contact => contact.name === name);
        if (contact) {
            dropDownMenu.innerHTML += temp_generateHtmlAssignedToContacts(contact);
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


function searchExistingContact() {
    renderAssignedToContacts();
    document.getElementById('dropDownMenu').classList.remove('d-none');
    let search = document.getElementById('searchContact').value;
    search = search.toLowerCase();
    let contactsDropdownMenu = document.getElementById('dropDownMenu');
    contactsDropdownMenu.innerHTML = '';
    for (let i = 0; i < contactsOnly.length; i++){
        let contact = contactsOnly[i];
        let contactName = contact['name'];
        if(contactName.toLowerCase().includes(search)){
            contactsDropdownMenu.innerHTML += temp_generateHtmlAssignedToContacts(contact);
        }
    }
}