function temp_generateHtmlAssignedToContacts(contact) {
    return /*html*/`
    <div class="dropDownContacts" id="dropDownContacts" onclick="toggleContactCheckbox(event, '${contact.email}')">
        <div class="initialNameContainer" id="initialNameContainer">
            <div class="initialsAssigned" id="initialsAssigned" style="background-color: ${contact.color}">${contact.initials}</div>
            <p id="contactNameAddTask">${contact.name}</p>
        </div>
        <div><input type="checkbox" id="${contact.email}" onclick="renderContactInitials('${contact.email}')"></div>
    </div>
    `
}

async function renderContactInitials(email){
    renderInitials()
    if(editTaskOpen){
        await addAssignedToToFireBase(email)
        let toDos = await getData("toDos");
        allToDos = Object.entries(toDos);
        let element = allToDos.filter((task) => task[1]["id"] == editId);
        element =  element[0];
        renderAssignedTo(element);
    }
}


function temp_generateHtmlAssignedToInitials (initial, color) {
    return /*html*/`
    <div class="renderedInitial" style="background-color: ${color};">${initial}</div>
    `
}


function temp_generateHtmlRenderSubtasks(subtask, i) {
    return /*html*/`
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
    `
}


function temp_generateHtmlEditSubtasks(index) {
    return /*html*/`
    <div class="subtask-edit-container">
            <input type="text" id="editInput-${index}" value="${subtaskArray[index]}">
            <div class="editSubtask-icon-container">
                <img src="./assets/img/delete.svg" alt="delete" onclick="cancelEditSubtask()">
                <div class="subtask-separator"></div>
                <img src="./assets/img/addtask_check.svg" alt="checkIcon" onclick="saveEditSubtask(${index})">
            </div>  
    </div>
    `
}