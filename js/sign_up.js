let contactsEmails = [];

function addUser() {
    let confirmPassword = document.getElementById('confirmPassword').value;
    let newContact = getInputValues();
    newContact.initials = createInitials(newContact.name);
    newContact.letter = newContact.name.charAt(0).toUpperCase();
    newContact.color = getRandomColor();
    console.log('der neue Kontakt ist:',newContact)
    if(!checkIfPasswordEqual(confirmPassword, newContact.password)){
        return console.log('password stimmt nicht überein')      
    }
    checkIfCheckboxChecked();
    //postData('contacts', newContact); 
    //getAllEmailsFromDb();
    checkIfEmailAlreadyExists(newContact.email);
    //showSuccessPopup();          
}


function getInputValues() {
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value.trim();
    return {'name': name, 'email': email, 'password': password}
}


async function getAllEmailsFromDb() {
    let allContacts = await getData('contacts');
    let userValues = Object.values(allContacts);
    //console.log('Die values:',userValues[1].email);
    contactsEmails = [];
    for (let i = 0; i < userValues.length; i++){
        contactsEmails.push(userValues[i].email)
        //console.log(userValues[i].email)
    }
}


function checkIfEmailAlreadyExists(email) {
    let submitButton = document.getElementById('signUpButton');
    console.log('alle Emails:',contactsEmails);
    if (contactsEmails.includes(email)) {
        console.log('Email existiert bereits!');
        document.getElementById('message-email-exist-p').classList.remove('d-none');
        submitButton.disabled = true;
    }else {
        submitButton.disabled = false;
        console.log('Email noch nicht vorhanden');
    }
}


function checkIfCheckboxChecked() {
    let checkbox = document.getElementById('agreeCheckbox');
    let submitButton = document.getElementById('signUpButton');
    if (checkbox.checked) {
        submitButton.disabled = false;   
        console.log('checkbox ist aktiviert')    
    }else {
        submitButton.disabled = true;
    }
}


function checkIfPasswordEqual(confirmPassword, password) {
    if(password === confirmPassword){
        return true
    }else {
        document.getElementById('message-wrong-password-p').classList.remove('d-none');
        return false
    }     
}


function showSuccessPopup() {
    let animatedContainer = document.getElementById('popup-text-container');
    animatedContainer.classList.add('visible');

    setTimeout(() => {
        animatedContainer.classList.remove('visible');
        window.location.href ='login.html';  
    }, 2000);
}