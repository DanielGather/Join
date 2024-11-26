/**
 * The ID of the contact being edited.
 * @type {string | undefined}
 */
let editId;

/**
 * Array containing all To-Dos.
 * @type {Array}
 */
let allToDosArr;

/**
 * Initializes the contacts page by rendering contacts and fetching To-Dos.
 * @returns {Promise<void>}
 */
async function contactsJS() {
    renderContactsLetter();
    await getAllToDos();
}

/**
 * Updates the page by syncing local storage, rendering contacts, and fetching To-Dos.
 * @returns {Promise<void>}
 */
async function updatePage() {
    await updateLS();
    renderContactsLetter();
    await getAllToDos();
}

/**
 * Renders contacts grouped by their initial letter into the container.
 */
function renderContactsLetter() {
    document.getElementById('renderContainer_contacts').innerHTML = '';
   
    let currentLetter = null;
    for (let i = 0; i < contactsLS.length; i++) {
        const id = contactsLS[i][0];
        const contact = contactsLS[i][1];
        
        if (contact.letter !== currentLetter) {
            currentLetter = contact.letter;
            document.getElementById('renderContainer_contacts').innerHTML += temp_letterContainer(contact.letter);
            renderContactCards(id, contact);
        } else {
            renderContactCards(id, contact);
        }
    }
}

/**
 * Renders individual contact cards under their respective letter grouping.
 * @param {string} id - The ID of the contact.
 * @param {Object} contact - The contact object.
 */
function renderContactCards(id, contact) {
    contact.phone = contact.phone || '-/-';
    document.getElementById(`contactsOf_${contact.letter}`).innerHTML += temp_contactCard(id, contact);
    setProfileImageColor(`color${id}`, contact);
}

/**
 * Sets the background color of a contact's profile image.
 * @param {string} elementId - The ID of the profile image element.
 * @param {Object} contact - The contact object.
 */
function setProfileImageColor(elementId, contact) {
    document.getElementById(elementId).style.backgroundColor = contact.color;
}

/**
 * Displays detailed information about a contact.
 * @param {string} id - The ID of the contact.
 */
function viewContact(id) {
    removeActiveLink('.contact-s-card', 'active-contact');
    document.getElementById(`cardContact${id}`).classList.add('active-contact');
    
    document.getElementById('secContacts').classList.add('hide-mobile');
    document.getElementById('secViewContact').classList.remove('hide-mobile');
    renderContactInfos(id);
    document.getElementById('mobileMenuDialog').innerHTML = temp_mobileMenu(id);
}

/**
 * Renders detailed information of a contact.
 * @param {string} id - The ID of the contact.
 */
function renderContactInfos(id) {
    let contact = idToContact(id);

    document.getElementById('sec_contactInfo').innerHTML = temp_contactInfo(id, contact);
    setProfileImageColor(`colorInfo${id}`, contact);
}

/**
 * Finds a contact by its ID.
 * @param {string} id - The ID of the contact.
 * @returns {Object | null} - The contact object or null if not found.
 */
function idToContact(id) {
    const contactEntry = contactsLS.find(contact => contact[0] == id);
    return contactEntry ? contactEntry[1] : null;
}

/**
 * Retrieves input values from given fields and formats them.
 * @param {string} nameId - The ID of the name input field.
 * @param {string} mailId - The ID of the email input field.
 * @param {string} phoneId - The ID of the phone input field.
 * @returns {Object} - An object containing name, email, and phone.
 */
function getInpValues(nameId, mailId, phoneId) {
    let mail = document.getElementById(mailId).value.trim();
    let phone = document.getElementById(phoneId).value.trim();
    let name = document.getElementById(nameId).value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, function(match) {return match.toUpperCase();});

    clearInputs();
    return {'name': name, 'email': mail, 'phone': phone};
}

/**
 * Clears all input fields on the page.
 */
function clearInputs() {
    document.querySelectorAll('input').forEach(input => input.value = '');
}

/**
 * Opens a modal dialog for adding a new contact and renders the contact's details.
 * @param {string} id - The ID of the new contact.
 * @returns {Promise<void>}
 */
async function openNewContact(id) {
    await updatePage();
    viewContact(id);
    renderContactInfos(id);
}

/**
 * Handles the addition of a new contact.
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function addContact(event) {
    event.preventDefault();

    let newContact = initializeContact('inpName', 'inpMail', 'inpPhone');
    let response = await postData('contacts', newContact);
    
    closeModal('addContactDialog');
    showAlert();
    await openNewContact(response.name);
}

/**
 * Initializes a contact object with formatted details.
 * @param {string} nameId - The ID of the name input field.
 * @param {string} mailId - The ID of the email input field.
 * @param {string} phoneId - The ID of the phone input field.
 * @returns {Object} - The initialized contact object.
 */
function initializeContact(nameId, mailId, phoneId) {
    const contact = getInpValues(nameId, mailId, phoneId);
    return {
        ...contact,
        initials: createInitials(contact.name),
        letter: contact.name.charAt(0).toUpperCase(),
        color: getRandomColor()
    };
}

/**
 * Fills input fields with the contact's details for editing.
 * @param {string} id - The ID of the contact to edit.
 */
function fillInputs(id) {
    let contact = idToContact(id);
    document.getElementById('editName').value = contact.name;
    document.getElementById('editEmail').value = contact.email;
    if (contact.phone == undefined || contact.phone == '-/-') {
        contact.phone = '';
    }
    document.getElementById('editPhone').value = contact.phone;
}

/**
 * Shows the contact's profile image in the edit dialog.
 * @param {string} id - The ID of the contact.
 */
function showEditImg(id) {
    let contact = idToContact(id);
    document.getElementById('editContactImg').innerHTML = contact.initials;
    document.getElementById('editContactImg').style.backgroundColor = contact.color;
}

/**
 * Updates the initials in real-time as the user types a name in the edit dialog.
 */
function realTimeInitial() {
    let input = document.getElementById('editName').value.trim();
    let initials = createInitials(input);
    document.getElementById('editContactImg').innerHTML = initials;
}

/**
 * Opens the edit dialog for a contact.
 * @param {string} id - The ID of the contact to edit.
 */
function openEditContact(id) {
    editId = id;
    openModal('editContactDialog');
    deleteButtonModal(id);
    fillInputs(id);
    showEditImg(id);
}

/**
 * Updates the contact details after editing and saves them to the database.
 * @async
 * @returns {Promise<void>}
 */
async function saveEdit(event) {
    event.preventDefault();
    let contact = idToContact(editId);

    let editContact = initializeContact('editName', 'editEmail', 'editPhone');
    editContact.color = contact.color;
    if (contact.password) {editContact.password = contact.password};
    
    await findAssignedEmail(contact.email, editContact.email);
    await putData(`contacts/${editId}`, editContact);
    closeModal('editContactDialog');
    await openNewContact(editId);
    loadUser();
    renderHeader('contacts');
}

/**
 * Toggles the delete button's visibility in the modal.
 * @param {string} id - The ID of the contact.
 */
function deleteButtonModal(id) {
    document.getElementById('modalDeleteButton').onclick = function() {
        closeModal('editContactDialog');
        deleteContact(id);
    };
}

/**
 * Deletes a contact from the database and updates the UI.
 * @async
 * @param {string} id - The ID of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(id) {
    if (id !== undefined) {
        await findAssignedEmail(idToContact(id).email);
        await deleteData(`contacts/${id}`);
        if (id == userId) {
            deleteUser();
        } else {    
            document.getElementById('sec_contactInfo').innerHTML = '';
            await updatePage();
            
            document.getElementById('secContacts').classList.remove('hide-mobile');
            document.getElementById('secViewContact').classList.add('hide-mobile');
        }
    }
}

/**
 * Logs out the user and redirects to the homepage.
 */
function deleteUser() {
    localStorage.setItem("remember", "false");
    logOut();
    window.location.href = "./index.html";
}

/**
 * Returns to the contact list view and resets the detailed contact view.
 */
function returnToContacts() {
    document.getElementById('sec_contactInfo').innerHTML = '';    
    document.getElementById('secContacts').classList.remove('hide-mobile');
    document.getElementById('secViewContact').classList.add('hide-mobile');
    removeActiveLink('.contact-s-card', 'active-contact');
}

/**
 * Opens a modal dialog.
 * @param {string} id - The ID of the modal dialog to open.
 */
function openModal(id) {
    const modal = document.getElementById(id);
    const classToOpen = id === 'mobileMenuDialog' ? 'menu-dialog-slide-right' : 'open';

    modal.showModal();
    setTimeout(() => modal.classList.add(classToOpen), 10);
    if (id === 'mobileMenuDialog') toggleResizeListener(true);
}

/**
 * Closes a modal dialog.
 * @param {string} id - The ID of the modal dialog to close.
 */
function closeModal(id) {
    const modal = document.getElementById(id);
    const classToClose = id === 'mobileMenuDialog' ? 'menu-dialog-slide-right' : 'open';
    
    modal.classList.remove(classToClose);
    setTimeout(() => modal.close(), 400);
    if (id === 'mobileMenuDialog') toggleResizeListener(false);
}

/**
 * Closes a modal dialog if the user clicks outside of it.
 * @param {Event} event - The click event.
 * @param {string} id - The ID of the modal dialog to close.
 */
function closeOnClickOutside(event, id) {
    const modal = document.getElementById(id);
    if (event.target === modal) {
      closeModal(id);
    }
}

/**
 * Toggles the resize event listener to close the mobile modal on window resize.
 * @param {boolean} open - Whether to add or remove the resize listener.
 */
function toggleResizeListener(open) {
    if (open) {
        window.addEventListener('resize', closeMobileModal);
    } else {
        window.removeEventListener('resize', closeMobileModal);
    }
}

/**
 * Closes a the mobile modal dialog if the vw >= 1024px.
 * @param {string} id - The ID of the modal dialog to close.
 */
function closeMobileModal() {
    if (window.innerWidth >= 1024) {
        closeModal('mobileMenuDialog')
    }
}

/**
 * Displays a temporary alert notification.
 * @param {string} [message='Contact successfully created'] - The alert message.
 */
function showAlert() {
    const alert = document.getElementById("alertCreatedContact");
    alert.style.display = 'unset';
  
    setTimeout(() => {
      alert.classList.add("show-allert");
    }, 200);

    setTimeout(() => {
      alert.classList.remove("show-allert");
      alert.classList.add("hide-allert");
    }, 2000);
  
    setTimeout(() => {
      alert.classList.remove("hide-allert");
      alert.style.display = 'none';
    }, 3000);
}

/**
 * Fetches all to-do items from the database and stores them in the global array `allToDosArr`.
 * @async
 * @returns {Promise<void>}
 */
async function getAllToDos() {
    allToDosArr = await getWhoelParthArr('toDos');
}

/**
 * Finds a to-do item assigned to a specific email and updates or deletes the assignment.
 * @async
 * @param {string} searchMail - The email to search for in the assignments.
 * @param {string|null} [newMail=null] - The new email to replace the assignment, or null to delete it.
 * @returns {Promise<void>}
 */
async function findAssignedEmail(searchMail, newMail = null) {
    for (const [toDoId, { assignedTo }] of allToDosArr) {
        if (assignedTo && typeof assignedTo === 'object') {
            Object.entries(assignedTo).forEach(([key, value]) => {
                if (value === searchMail) {
                    newMail ? editAssignedMail(toDoId, key, newMail) : deleteAssigned(toDoId, key);
                }
            });
        }
    }
}

/**
 * Updates the email assigned to a specific to-do item.
 * @async
 * @param {string} id - The ID of the to-do item.
 * @param {string} key - The key of the assigned email.
 * @param {string} newMail - The new email to assign.
 * @returns {Promise<void>}
 */
async function editAssignedMail(id, key, newMail){
    await putData(`toDos/${id}/assignedTo/${key}`, newMail);
}

/**
 * Deletes an email assignment from a specific to-do item.
 * @async
 * @param {string} id - The ID of the to-do item.
 * @param {string} key - The key of the assigned email.
 * @returns {Promise<void>}
 */
async function deleteAssigned(id, key){
    await deleteData(`toDos/${id}/assignedTo/${key}`);
}
