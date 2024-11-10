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

function changeType(action) {
    let inpPass = document.getElementById('inpPass');
    inpPass.type = action === 'open' ? 'text' : 'password';
    changeEye();
}

function changeEye() {
    document.getElementById('closeEye').classList.toggle('hidden');
    document.getElementById('openEye').classList.toggle('hidden');
}

function showWrongMessage() {
    document.getElementById('inpMail').classList.add('wrong-value');
    document.getElementById('inpPass').classList.add('wrong-value');
    document.getElementById('wrongMessage').style.display = 'block';
}


// user
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
    } else {showWrongMessage()}
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
}

function returnButton() {
    document.getElementById('renderForm').innerHTML = temp_logIn();
    document.getElementById('logInHeader').classList.toggle('hidden'); 
    document.getElementById('buttonsToSingUp').classList.toggle('hidden');
    document.getElementById('renderForm').classList.toggle("form-render-container-singUp");
}