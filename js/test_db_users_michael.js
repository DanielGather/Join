// const BASE_URL = 'https://join-cf048-default-rtdb.europe-west1.firebasedatabase.app/';


async function init() {
    console.log('go!');
    //postData('', {'banana': 'rama'});
    //deleteData(''); // bei DELETE sollte nicht lehr stehen, sonst wird alles gelöscht!
    //putData('test', {'test2': 'success'});
    //getData('test');
    await putData('users', {user:"Enes", password:"12345"})
    await getData('users');

}

async function getData(path='') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    console.log(responseToJson);
    //return responseToJson;
}

async function postData(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'post',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

async function deleteData(path='') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}


async function putData(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'PUT', /* or PATCH  || !!PATCH funktioniert nicht mit firebase */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}
