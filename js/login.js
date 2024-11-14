async function indexInit() {
    await updateLS();
    startAnimation();
    renderLogIn();
}

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

function changeType(id, action) {
    let inpPass = document.getElementById(id);
    inpPass.type = action === 'open' ? 'text' : 'password';
    changeEye(id);
}

function changeEye(id) {
    if (id == "inpPass") {
        document.getElementById('closeEye').classList.toggle('hidden');
        document.getElementById('openEye').classList.toggle('hidden');
    }
    if (id == "inpPassConfirm") {
        document.getElementById('closeEyeConfirm').classList.toggle('hidden');
        document.getElementById('openEyeConfirm').classList.toggle('hidden');
    }
}

function showWrongMessage(id) {
    // document.getElementById(id).style.display = 'block';
    document.getElementById(id).classList.add('show-message');
}

function colorWrongInp(id) {
    document.getElementById(id).classList.add('wrong-value');
}

function setUser(id, remember) {
    localStorage.setItem("user", id);
    localStorage.setItem("logIn", "true");
    localStorage.setItem("remember", remember);
}

function guestLogIn() {
    setUser("guest", "false")
    window.location.href = "./summary.html";
}

function userLogIn(event) {
    event.preventDefault();

    if (checkPasswordAndUser()) {
        const user = getUserFromLogIn()
        let remember = document.getElementById('rememberCheckbox').checked;
        setUser(user[0], remember);
        window.location.href = "./summary.html";
    } else {
        colorWrongInp('inpMail');
        colorWrongInp('inpPass');
        showWrongMessage('wrongMessageMail');
    }
}

function checkPasswordAndUser() {
    const inpEmail = document.getElementById('inpMail').value.trim();
    const inpPassword = document.getElementById('inpPass').value;

    const contact = contactsLS.find(contact => contact[1].email === inpEmail);
    return contact && contact[1].password === inpPassword;
}

function getUserFromLogIn() {
    const inpEmail = document.getElementById('inpMail').value.trim();
    return contactsLS.find(contact => contact[1].email === inpEmail);
}

function fillRememberUser() {
    let id = localStorage.getItem('user');
    let user = getUserFromContacts(id);

    document.getElementById('inpMail').value = user[1].email;
    document.getElementById('inpPass').value = user[1].password;
    document.getElementById('rememberCheckbox').checked = true;
}

function renderLogIn() {
    document.getElementById('renderForm').innerHTML = temp_logIn();
    
    let remember = localStorage.getItem('remember') == 'true';
    if (remember) {
        fillRememberUser();
    }
}

function renderSignUp() {
    document.getElementById('renderForm').innerHTML = temp_singUp();
    document.getElementById('logInHeader').classList.toggle('hidden');
    document.getElementById('buttonsToSingUp').classList.toggle('hidden');
    document.getElementById('renderForm').classList.toggle("form-render-container-singUp");
    document.title = "Join - Sign Up"
}

function returnButton() {
    document.getElementById('renderForm').innerHTML = temp_logIn();
    document.getElementById('logInHeader').classList.toggle('hidden'); 
    document.getElementById('buttonsToSingUp').classList.toggle('hidden');
    document.getElementById('renderForm').classList.toggle("form-render-container-singUp");
    document.title = "Join - Log In"
}

async function addUser(event) {
    event.preventDefault();
    resetWrongMessages();

    const newContact = getInputValues();
    const confirmPassword = document.getElementById('inpPassConfirm').value;
    const exists = contactsOnly.some(contact => contact.email === newContact.email);

    if (exists) {
        return colorWrongInp('inpMail'), showWrongMessage('wrongMessageMail');
    }

    if (confirmPassword !== newContact.password) {
        return colorWrongInp('inpPassConfirm'), showWrongMessage('wrongMessagePass');
    }

    await postData('contacts', newContact);
    await updateLS();
    showSuccessPopup();
    returnButton();
}

function resetWrongMessages() {
    let messages = document.querySelectorAll('.show-message');
    let inputs = document.querySelectorAll('.wrong-value');

    messages.forEach(message => message.classList.remove('show-message'));
    inputs.forEach(input => input.classList.remove('wrong-value'));
}

function getInputValues() {
    let name = document.getElementById('inpName').value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, function(match) {return match.toUpperCase();});
    let email = document.getElementById('inpMail').value.trim();
    let password = document.getElementById('inpPass').value;
    let initials = createInitials(name);
    let letter = name.charAt(0).toUpperCase();
    let color = getRandomColor();
    return { 'name': name, 'email': email, 'password': password, 'initials': initials, 'letter': letter, 'color': color }
}

function showSuccessPopup() {
    let animatedContainer = document.getElementById('popup-text-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
    }, 2000);
}

function toggleSubmitButton() {
    const form = document.forms[0];
    const submitButton = document.getElementById('signUpButton');
    submitButton.disabled = !form.checkValidity();
}
