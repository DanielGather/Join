function temp_generateHtmlAssignedToContacts(contact) {
    return /*html*/`
    <div class="dropDownContacts" id="dropDownContacts">
        <div class="initialNameContainer" id="initialNameContainer">
            <div class="initialsAssigned" id="initialsAssigned" style="background-color: ${contact.color}">${contact.initials}</div>
            <p id="contactNameAddTask">${contact.name}</p>
        </div>
        <input type="checkbox" id="${contact.email}" onclick="renderInitials('${contact.initials}', '${contact.color}')">
    </div>
    `
}