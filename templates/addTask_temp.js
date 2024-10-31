function temp_generateHtmlAssignedToContacts(name, initial, color) {
    return /*html*/`
    <div class="dropDownContacts" id="dropDownContacts">
        <div class="initialNameContainer" id="initialNameContainer">
            <div class="initialsAssigned" id="initialsAssigned" style="background-color: ${color}">${initial}</div>
            <p id="contactNameAddTask">${name}</p>
        </div>
        <input type="checkbox" id="contactCheckbox" onclick="renderInitials('${initial}', '${color}')">
    </div>
    `
}