async function addUser() {
    await updateLS()
    let confirmPassword = document.getElementById('confirmPassword').value;
    let newContact = getInputValues();
    console.log('der neue Kontakt ist:',newContact)
    if(!checkIfPasswordEqual(confirmPassword, newContact.password)){
        return console.log('password stimmt nicht überein')      
    }
    checkIfCheckboxChecked();
    let allEmails = getAllEmailsFromDb();
    let emailExist = checkIfEmailAlreadyExists(newContact.email, allEmails);
    if (!emailExist) {postData('contacts', newContact)};
    showSuccessPopup();       
}


function getInputValues() {
    let name = document.getElementById('name').value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, function(match) {return match.toUpperCase();});
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value.trim();
    let initials = createInitials(name);
    let letter = name.charAt(0).toUpperCase();
    let color = getRandomColor();
    return {'name': name, 'email': email, 'password': password, 'initials': initials, 'letter': letter, 'color': color}
}


function getAllEmailsFromDb() {
    let contactsEmails = [];
    for (let i = 0; i < contactsOnly.length; i++){
        contactsEmails.push(contactsOnly[i].email)
        //console.log(userValues[i].email)
    }
    console.log(contactsEmails);
    
    return contactsEmails;
}


function checkIfEmailAlreadyExists(email, allEmails) {
    if (allEmails.includes(email)) {
        console.log('Email existiert bereits!');
        document.getElementById('message-email-exist-p').classList.remove('d-none');
        return true;
    }else {
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