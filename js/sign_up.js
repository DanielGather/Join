
function addUser() {
    console.log('signUp test test');
    addData();
}


function addData() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    checkIfPasswordEqual(name, email, confirmPassword, password);
    
    //console.log({'name': name, 'email': email, 'pass': password});
}


const BASE_URL = 'https://join-cf048-default-rtdb.europe-west1.firebasedatabase.app/';

//const BASE_URL = 'https://projekttest20241002-default-rtdb.europe-west1.firebasedatabase.app/';


async function postData(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'post',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    return responseToJson;
}


function checkIfEmailAlreadyExist() {
    // prüfen ob email schon in der Datenbank
}


function checkIfPasswordEqual(name, email, confirmPassword, password) {
    if(password === confirmPassword){
        postData('/contacts', {'name': name, 'email': email, 'pass': password});
    }else {
        document.getElementById('message-wrong-password-p').classList.remove('d-none');
    }     
}