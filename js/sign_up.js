async function addUser() {
    await updateLS()
    let confirmPassword = document.getElementById('confirmPasswordInput').value;
    let newContact = getInputValues();
    console.log('der neue Kontakt ist:', newContact)
    if (!checkIfPasswordEqual(confirmPassword, newContact.password)) {
        return console.log('password stimmt nicht überein')
    }
    checkIfCheckboxChecked();
    let allEmails = getAllEmailsFromDb();
    let emailExist = checkIfEmailAlreadyExists(newContact.email, allEmails);
    if (!emailExist) { postData('contacts', newContact) };
    showSuccessPopup();

}

//#########################################################################

async function addUser_01(event) {
    event.preventDefault();

    // reset wrongValueMessages

    let newContact = getInputValues();
    let confirmPassword = document.getElementById('inpPassConfirm').value;
    console.log('der neue Kontakt ist:', newContact)

    if (checkExistEmail(newContact.email)) {
        return console.log('email exestiert bereits');
    }

    if (!checkIfPasswordEqual(confirmPassword, newContact.password)) {
        return console.log('password stimmt nicht überein')
    }


    //await postData('contacts', newContact);
    showSuccessPopup();
}

function checkExistEmail(newEmail) {
    const exists = contactsOnly.some(contact => contact.email === newEmail);
    return exists;
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

function checkIfPasswordEqual(confirmPassword, password) {
    if (password === confirmPassword) {
        return true
    } else {
        document.getElementById('messageWrongPasswordConf').classList.remove('d-none');
        document.getElementById('inpPassConfirm').classList.add('red-border');
        return false
    }
}

function showSuccessPopup() {
    let animatedContainer = document.getElementById('popup-text-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
        window.location.href = 'login.html';
    }, 2000);
}

//#########################################################################

function getInputValues() {

    let name = document.getElementById('name').value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, function(match) {return match.toUpperCase();});
    let email = document.getElementById('email').value;
    let password = document.getElementById('passwordInput').value.trim();
    let initials = createInitials(name);
    let letter = name.charAt(0).toUpperCase();
    let color = getRandomColor();
    return { 'name': name, 'email': email, 'password': password, 'initials': initials, 'letter': letter, 'color': color }
}


function getAllEmailsFromDb() {
    let contactsEmails = [];
    for (let i = 0; i < contactsOnly.length; i++) {
        contactsEmails.push(contactsOnly[i].email)
    }
    console.log(contactsEmails);
    return contactsEmails;
}


function checkIfEmailAlreadyExists(email, allEmails) {
    if (allEmails.includes(email)) {
        console.log('Email existiert bereits!');
        document.getElementById('message-email-exist-p').classList.remove('d-none');
        return true;
    } else {
        console.log('Email noch nicht vorhanden');
        return false;
    }
}


function checkIfCheckboxChecked() {
    let checkbox = document.getElementById('agreeCheckbox');
    let submitButton = document.getElementById('signUpButton');
    if (checkbox.checked) {
        submitButton.disabled = false;
        console.log('checkbox ist aktiviert')
    } else {
        submitButton.disabled = true;
    }
}


function checkIfPasswordEqual(confirmPassword, password) {
    if (password === confirmPassword) {
        return true
    } else {
        document.getElementById('message-wrong-password-p').classList.remove('d-none');
        document.getElementById('signUp-input-confirm-password-message-container').classList.add('red-border');
        return false
    }
}


function showSuccessPopup() {
    let animatedContainer = document.getElementById('popup-text-container');
    animatedContainer.classList.add('visible');
    setTimeout(() => {
        animatedContainer.classList.remove('visible');
        window.location.href = 'login.html';
    }, 2000);
}


function changeImageWhenClickInputfield() {
    let image = document.getElementById('lockImage');
    image.src = "./assets/img/visibility_off.svg";
    let container = document.getElementById('signUp-input-password-container');
    container.classList.add('light-blue-border');
}


function resetPasswordInputBorderColor() {
    let container = document.getElementById('signUp-input-password-container');
    container.classList.remove('light-blue-border');
}


function changeImage() {
    let passwordInput = document.getElementById('passwordInput');
    let image = document.getElementById('lockImage');
    if (image.src.includes("visibility_off.svg")) {
        image.src = "./assets/img/visibility.svg";
        passwordInput.type = "text";
    } else {
        image.src = "./assets/img/visibility_off.svg";
        passwordInput.type = "password";
    }
}


function changeConfirmImageWhenClickInputfield(){
    let image = document.getElementById('confirmLockImage');
    image.src = "./assets/img/visibility_off.svg";
    let container = document.getElementById('signUp-input-confirm-password-message-container');
    container.classList.add('light-blue-border');
}


function resetConfirmPasswordInputBorderColor() {
    let container = document.getElementById('signUp-input-confirm-password-message-container');
    container.classList.remove('light-blue-border');
}


function changeConfirmImage() {
    let passwordConfirmInput = document.getElementById('confirmPasswordInput');
    let image = document.getElementById('confirmLockImage');
    if (image.src.includes("visibility_off.svg")) {
        image.src = "./assets/img/visibility.svg";
        passwordConfirmInput.type = "text";
    } else {
        image.src = "./assets/img/visibility_off.svg";
        passwordConfirmInput.type = "password";
    }
}
