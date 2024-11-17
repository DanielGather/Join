/**
 * Initializes the index page by updating local storage, starting the animation, and rendering the login form.
 * @async
 */
async function indexInit() {
    await updateLS();
    startAnimation();
    renderLogIn();
}

/**
 * Starts the animation by fading out the background and hiding it after a delay.
 */
function startAnimation() {
    let background = document.getElementById('backgroundAnimation');

    setTimeout(() => {
        document.getElementById('logoAnimation').classList.add('end-position-logo');
        background.style.opacity = 0;
    }, 500);

    setTimeout(() => {
        background.classList.add('d-none');
    }, 1500);
}

/**
 * Changes the input field type to show or hide the password and toggles visibility of eye icons.
 * @param {string} id - The ID of the input element.
 * @param {string} action - The action to perform ('open' or 'close').
 */
function changeType(id, action) {
    let input = document.getElementById(id);
    input.type = action === 'open' ? 'text' : 'password';

    const eyeState = id === "inpPass" ? '' : 'Confirm';
    document.getElementById(`closeEye${eyeState}`).classList.toggle('hidden');
    document.getElementById(`openEye${eyeState}`).classList.toggle('hidden');
}

/**
 * Displays a warning message by adding a specific CSS class to the element.
 * @param {string} id - The ID of the element to show the message for.
 */
function showWrongMessage(id) {
    document.getElementById(id).classList.add('show-message');
}

/**
 * Highlights an input field with an error by adding a specific CSS class.
 * @param {string} id - The ID of the input field to highlight.
 */
function colorWrongInp(id) {
    document.getElementById(id).classList.add('wrong-value');
}

/**
 * Sets the logged-in user's ID and login status in localStorage.
 * @param {string} id - The user's ID.
 * @param {string} remember - Whether the user opted to be remembered ('true' or 'false').
 */
function setUser(id, remember) {
    localStorage.setItem("user", id);
    localStorage.setItem("logIn", "true");
    localStorage.setItem("remember", remember);
}

/**
 * Logs in as a guest user and redirects to the summary page.
 */
function guestLogIn() {
    setUser("guest", "false");
    window.location.href = "./summary.html";
}

/**
 * Handles user login by validating input and redirecting to the summary page upon success.
 * @param {Event} event - The event object.
 */
function userLogIn(event) {
    event.preventDefault();

    if (checkPasswordAndUser()) {        
        const user = getUserFromLogIn();
        
        let remember = document.getElementById('rememberCheckbox').checked;
        setUser(user[0], remember);
        window.location.href = "./summary.html";
    } else {
        colorWrongInp('inpMail');
        colorWrongInp('inpPass');
        showWrongMessage('wrongMessageMail');
    }
}

/**
 * Checks if the email and password entered match a contact in the local storage.
 * @returns {boolean} True if the credentials are valid, false otherwise.
 */
function checkPasswordAndUser() {
    const inpEmail = document.getElementById('inpMail').value.trim();
    const inpPassword = document.getElementById('inpPass').value;

    if (!contactsLS || contactsLS.length === 0) {
        console.error("Contact list is empty or undefined.");
        return false;
    }

    const contact = contactsLS.find(contact => contact[1].email === inpEmail);
    return contact && contact[1].password === inpPassword;
}

/**
 * Retrieves the user array matching the email input.
 * @returns {Array} The user array containing the id and an object whit user properties like name, email, password, and others.
 * @example
 * [
 * "-asfhssdfa783493",
 * {
 *   color: "#00A1E9",
 *   email: "example@mail.com",
 *   initials: "JD",
 *   letter: "J",
 *   name: "John Doe",
 *   password: "SecurePass123"
 * }
 * ]
 */
function getUserFromLogIn() {
    const inpEmail = document.getElementById('inpMail').value.trim();
    return contactsLS.find(contact => contact[1].email === inpEmail);
}

/**
 * Populates the login form with the remembered user's data from localStorage.
 */
function fillRememberUser() {
    let id = localStorage.getItem('user');
    let user = getUserFromContacts(id);

    document.getElementById('inpMail').value = user[1].email;
    document.getElementById('inpPass').value = user[1].password;
    document.getElementById('rememberCheckbox').checked = true;
}

/**
 * Renders the login form and fills it with user data if the "remember me" option was selected.
 */
function renderLogIn() {
    document.getElementById('renderForm').innerHTML = temp_logIn();
    
    let remember = localStorage.getItem('remember') == 'true';
    if (remember) {
        fillRememberUser();
    }
}

/**
 * Renders the sign-up form and adjusts the layout accordingly.
 */
function renderSignUp() {
    document.getElementById('renderForm').innerHTML = temp_singUp();
    document.getElementById('logInHeader').classList.toggle('hidden');
    document.getElementById('buttonsToSingUp').classList.toggle('hidden');
    document.getElementById('renderForm').classList.toggle("form-render-container-singUp");
    document.title = "Join - Sign Up";
}

/**
 * Resets the form to render the login view.
 */
function returnButton() {
    document.getElementById('renderForm').innerHTML = temp_logIn();
    document.getElementById('logInHeader').classList.toggle('hidden'); 
    document.getElementById('buttonsToSingUp').classList.toggle('hidden');
    document.getElementById('renderForm').classList.toggle("form-render-container-singUp");
    document.title = "Join - Log In";
}

/**
 * Adds a new user by validating the input, ensuring the user doesn't already exist, and saving them.
 * @param {Event} event - The event object.
 */
async function addUser(event) {
    event.preventDefault();
    resetWrongMessages();

    const newContact = getInputValues();
    const confirmPassword = document.getElementById('inpPassConfirm').value;
    const exists = contactsOnly.some(contact => contact.email === newContact.email);

    if (exists) return errInput();  

    if (confirmPassword !== newContact.password) return errPassword();

    await saveNewUser(newContact);
}

/**
 * Saves a new user to the database and updates localStorage.
 * @param {Object} newContact - The new user's data.
 */
async function saveNewUser(newContact) {
    try {
        await postData('contacts', newContact);
        await updateLS();
        showSuccessPopup();
        returnButton();
    } catch (error) {
        console.error("Failed to add user:", error);
        alert("An error occurred while adding the user.");
    }
}

/**
 * Displays an error message for invalid input.
 */
function errInput() {
    colorWrongInp('inpMail');
    showWrongMessage('wrongMessageMail');
}

/**
 * Displays an error message for mismatched passwords.
 */
function errPassword() {
    colorWrongInp('inpPassConfirm');
    showWrongMessage('wrongMessagePass');
}

/**
 * Resets all visible error messages and input error states.
 */
function resetWrongMessages() {
    let messages = document.querySelectorAll('.show-message');
    let inputs = document.querySelectorAll('.wrong-value');

    messages.forEach(message => message.classList.remove('show-message'));
    inputs.forEach(input => input.classList.remove('wrong-value'));
}

/**
 * Retrieves input values for creating a new user.
 * @returns {Object} The new user's data.
 */
function getInputValues() {
    let name = document.getElementById('inpName').value
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, match => match.toUpperCase());
    let email = document.getElementById('inpMail').value.trim();
    let password = document.getElementById('inpPass').value;
    let initials = createInitials(name);
    let letter = name.charAt(0).toUpperCase();
    let color = getRandomColor();
    return { name, email, password, initials, letter, color };
}

/**
 * Shows a success popup animation for a short duration.
 */
function showSuccessPopup() {
    let animatedContainer = document.getElementById('popup-text-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
    }, 2000);
}

/**
 * Toggles the submit button's disabled state based on form validity.
 */
function toggleSubmitButton() {
    const form = document.forms[0];
    const submitButton = document.getElementById('signUpButton');
    submitButton.disabled = !form.checkValidity();
}