let subtaskArray = [];
let statusPriority = 'medium';
let selectedCategory = null;
let assignedToContacts = null;
let allCurrentIds = [];
let checkedContactNames = [];
let checkedContactInitials = [];
let checkedContactColors = [];

/**
 * Handles the submission event for a form and delegates actions based on the 
 * button that triggered the submission.
 * Prevents the default form submission behavior and executes specific logic 
 * depending on the button ID ("clear" or "createTask").
 * 
 * @param {Event} event - The submission event object triggered by the form.
 * @param {string} type - A string specifying the type of task or operation to perform.
 * 
 * @returns {boolean} Always returns false to prevent the default form submission.
 */
function handleSubmit(event, type) {
    event.preventDefault();
    const submitButton = event.submitter;
    if (submitButton.id === "clear") {
        clear();
    } else if (submitButton.id === "createTask") {
        createTask(type);
    }
    return false;
}

/**
 * Creates a new task with a unique ID, saves it to a database, and optionally 
 * adds associated subtasks. Displays a success popup after the task is created.
 * 
 * @async
 * 
 * @param {string} type - The type of task being created, used to determine task attributes.
 * 
 * @returns {Promise<void>} This function is asynchronous and does not return a value.
 * 
 * @description
 * 1. Fetches all existing tasks from the database to ensure ID consistency.
 * 2. Generates a new unique ID for the task.
 * 3. Collects user input values to define the task's properties.
 * 4. Sends the new task data to the server and retrieves the assigned task ID.
 * 5. If subtasks are provided, iterates over the subtasks array and sends each 
 *    subtask to the server, associating it with the main task ID.
 * 6. Displays a success message once the task and subtasks (if any) are successfully added.
 */
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

/**
 * Retrieves and aggregates user input values for creating a new task object.
 * Collects data such as title, description, due date, priority, category, 
 * assigned contacts, and a unique task ID, then formats it into an object.
 * 
 * @param {number} idNum - The unique ID number for the task.
 * @param {string} type - The type of task being created, used to categorize or differentiate tasks.
 * 
 * @returns {Object} A structured object containing all the input values needed to define the task.
 */
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

/**
 * Constructs a task object with the provided input values.
 * Maps input fields into a structured object format suitable for task storage and processing.
 * 
 * @returns {Object} A structured task object containing all the provided input values.
 */
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

/**
 * Retrieves all existing to-do items from the database and extracts their IDs.
 * If no data is found, initializes the ID list with a default value.
 * 
 * @async
 * @returns {Promise<void>} This function does not return a value.
 * 
 * @throws {Error} Logs a warning if the data is unavailable or the specified path does not exist.
 */
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

/**
 * Generates a new unique ID based on the current list of IDs.
 * It checks the array of existing IDs and returns the next available ID by incrementing the highest value.
 * If the list of IDs is empty, it returns 1 as the starting ID.
 * 
 * @returns {number} The new unique ID.
 */
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

/**
 * Retrieves the value entered in the description input field.
 * It accesses the DOM element with the ID 'textForDescription' and returns the current value of the field.
 * 
 * @returns {string} The current value of the description input field.
 */
function getDescription() {
    let description = document.getElementById('textForDescription').value;
    return description;
}

/**
 * Retrieves the value entered in the due date input field and changes its time format.
 * It accesses the DOM element with the ID 'inputDate', gets the value (due date),
 * and then converts the format using the `changeTimeFormat` function.
 * 
 * @returns {string} The formatted due date as a string.
 */
function getDueDate() {
    let dueDate = document.getElementById('inputDate').value;
    dueDate = changeTimeFormat(dueDate);
    return dueDate
}

/**
 * Checks if the "Create Task" button should be enabled or disabled based on user input.
 * It verifies that the title input, due date input, and category selection are filled.
 * If all conditions are met (title, date, and category), the "Create Task" button is enabled.
 * Otherwise, the button is disabled.
 * 
 * @returns {void} This function does not return a value.
 */
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

/**
 * Renders the initials of checked contacts and updates the assigned contacts list.
 * This function first clears the current stored contact data (names, initials, and colors).
 * It then retrieves the checked contacts, processes them, and updates the displayed initials
 * and assigned contacts in the UI.
 * 
 * @returns {void} This function does not return a value.
 */
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

/**
 * Processes a checked contact and updates the contact's name, initials, and color 
 * in the corresponding arrays. The contact is identified by the checkbox's ID, 
 * which corresponds to the contact's email address.
 * 
 * The function looks for the contact in the `contactsOnly` array, retrieves 
 * the contact's `name`, `initials`, and `color`, and adds them to the global 
 * arrays `checkedContactNames`, `checkedContactInitials`, and `checkedContactColors`.
 * 
 * @param {HTMLInputElement} checkbox - The checkbox element that represents a selected contact.
 * @returns {void} This function does not return a value, but updates global arrays.
 */
function processCheckedContact(checkbox) {
    let checkedContact = contactsOnly.filter(contact => contact.email == checkbox.id);
    let name = checkedContact[0].name;
    let initial = checkedContact[0].initials;
    let color = checkedContact[0].color;
    checkedContactNames.push(name);
    checkedContactInitials.push(initial);
    checkedContactColors.push(color);
}

/**
 * Updates the rendered initials container by clearing its content and re-rendering 
 * the initials of the selected contacts along with their corresponding colors.
 * 
 * This function iterates over the provided `checkedContactInitials` and `checkedContactColors` 
 * arrays, generating HTML for each contact's initials and color, and appends it 
 * to the `renderedInitialsContainer` element.
 * 
 * @param {Array<string>} checkedContactInitials - An array of initials of the selected contacts.
 * @param {Array<string>} checkedContactColors - An array of colors corresponding to the selected contacts' initials.
 * @returns {void} This function does not return a value, but updates the DOM by appending HTML elements.
 */
function updateRenderedInitials(checkedContactInitials, checkedContactColors) {
    let renderedInitialsContainer = document.getElementById('renderedInitialsContainer');
    renderedInitialsContainer.innerHTML = '';
    checkedContactInitials.forEach((initial, index) => {
        let color = checkedContactColors[index];
        renderedInitialsContainer.innerHTML += temp_generateHtmlAssignedToInitials(initial, color);
    });
}

/**
 * Retrieves the checked contacts from the contact selection checkboxes and returns an object 
 * mapping a generated key to the email address of each selected contact.
 * 
 * This function iterates over all the checkboxes inside the `.dropDownContacts` dropdown, 
 * checks which ones are selected, and then matches each selected checkbox's ID (email) with 
 * the contacts in the `contactsOnly` array. It creates a key-value pair where the key is 
 * a string `userEmail` followed by a counter (starting from 1), and the value is the email 
 * of the selected contact.
 * 
 * @returns {Object} An object where each key represents a unique identifier for a selected 
 * contact, and each value is the corresponding contact's email address.
 */
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

/**
 * Renders the list of contacts, separating them into checked and unchecked contacts, and populates
 * the dropdown menu with the corresponding contact information.
 * 
 * This function first clears the current contents of the dropdown menu with the ID `dropDownMenu`. It then loops
 * through the `checkedContactNames` array (containing the names of checked contacts) and adds the corresponding 
 * contact details to the dropdown using the `temp_generateHtmlAssignedToContacts` function. Afterward, it loops through
 * all contacts in the `contactsOnly` array and adds the remaining unchecked contacts to the dropdown.
 * Finally, it calls `updateCheckboxStatus` to ensure the checkbox states are updated accordingly.
 * 
 * @returns {void} This function does not return a value.
 */
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

/**
 * Updates the checkbox status to reflect which contacts are selected (checked) in the dropdown menu.
 * 
 * This function loops through all checkboxes inside the `.dropDownContacts` element and checks whether 
 * the contact associated with each checkbox is present in the `checkedContactNames` array. If the contact 
 * is in the array, the checkbox is marked as checked; otherwise, it is unchecked.
 * 
 * The function relies on the contact's email being used as the `id` of each checkbox and compares it 
 * with the names stored in the `checkedContactNames` array to determine if the checkbox should be checked or not.
 * 
 * @returns {void} This function does not return any value.
 */
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

/**
 * Searches for existing contacts based on the input search query and renders the matching contacts in the dropdown menu.
 * 
 * This function retrieves the value from the search input field (`#searchContact`), filters through the `contactsOnly` array 
 * to find contacts whose names include the search query, and then updates the dropdown menu with the filtered contacts.
 * It ensures that the dropdown menu is visible by removing the `d-none` class and re-renders the contact list based on the search query.
 * 
 * @returns {void} This function does not return any value, but modifies the UI by updating the dropdown menu with search results.
 */
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

(function setMinDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById('inputDate').setAttribute('min', minDate);
})();