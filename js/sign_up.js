
function addUser() {
    let confirmPassword = document.getElementById('confirmPassword').value;
    let newContact = getInputValues();
    newContact.initials = createInitials(newContact.name);
    newContact.letter = newContact.name.charAt(0).toUpperCase();
    newContact.color = getRandomColor();
    console.log(newContact)
    if(!checkIfPasswordEqual(confirmPassword, newContact.password)){
        return console.log('password stimmt nicht überein')      
    }
    checkIfCheckboxChecked();
    postData('contacts', newContact);    
}

function getInputValues() {
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    return {'name': name, 'email': email, 'password': password}
}


function checkIfEmailAlreadyExist() {
    // prüfen ob email schon in der Datenbank
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