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
    return responseToJson;
}

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

async function deleteData(path='') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'DELETE',
    });
    let responseToJson = await response.json();
    return responseToJson;
}


async function putData(path='', data={}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'PUT', /* or PATCH  || !!PATCH funktioniert nicht mit firebase */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    return responseToJson;
}


/*

postData('contacts', {
    "letter": "A",
    "name": "Aaron Smith",
    "initials": "AS",
    "email": "aaron.smith@example.com",
    "phone": "+4912345678901",
    "color": "blue"
})

*/

// function adAllContacts(list) {
//     contacts.forEach(element => postData('contacts', element))
// }

let contacts = [
    {
        "letter": "A",
        "name": "Adam Green",
        "initials": "AG",
        "email": "adam.green@example.com",
        "phone": "+49 234 567 8901"
    },
    {
        "letter": "A",
        "name": "Alice Turner",
        "initials": "AT",
        "email": "alice.turner@example.com",
        "phone": "+49 123 456 7890"
    },
    {
        "letter": "B",
        "name": "Barbara Evans",
        "initials": "BE",
        "email": "christina16@chandler.info",
        "phone": "+49 078 644 7883"
    },
    {
        "letter": "B",
        "name": "Brenda Santana",
        "initials": "BS",
        "email": "trodriguez@gmail.com",
        "phone": "+49 273 910 2805"
    },
    {
        "letter": "C",
        "name": "Christina Adams",
        "initials": "CA",
        "email": "jconner@gmail.com",
        "phone": "+49 907 707 0200"
    },
    {
        "letter": "C",
        "name": "Christina Livingston",
        "initials": "CL",
        "email": "tyrone24@rodriguez-flores.com",
        "phone": "+49 328 227 5215"
    },
    {
        "letter": "D",
        "name": "David Ball",
        "initials": "DB",
        "email": "harrisjacqueline@gonzalez.net",
        "phone": "+49 484 641 1670"
    },
    {
        "letter": "G",
        "name": "Glen Smith",
        "initials": "GS",
        "email": "michael56@hotmail.com",
        "phone": "+49 135 876 0422"
    },
    {
        "letter": "J",
        "name": "Jamie Lane",
        "initials": "JL",
        "email": "petersalexander@walters.net",
        "phone": "+49 790 631 7169"
    },
    {
        "letter": "K",
        "name": "Kevin Smith",
        "initials": "KS",
        "email": "brooksmichael@hotmail.com",
        "phone": "+49 769 196 7735"
    },
    {
        "letter": "K",
        "name": "Kevin Taylor",
        "initials": "KT",
        "email": "michaelrose@gmail.com",
        "phone": "+49 512 891 7581"
    },
    {
        "letter": "M",
        "name": "Michelle Howard",
        "initials": "MH",
        "email": "woodskatherine@yahoo.com",
        "phone": "+49 589 838 4401"
    },
    {
        "letter": "R",
        "name": "Randy Morgan",
        "initials": "RM",
        "email": "aescobar@kelley.com",
        "phone": "+49 533 793 8174"
    },
    {
        "letter": "S",
        "name": "Samantha Berg",
        "initials": "SB",
        "email": "kharris@yahoo.com",
        "phone": "+49 229 785 1555"
    },
    {
        "letter": "S",
        "name": "Shawn Spears",
        "initials": "SS",
        "email": "padillalori@perez.org",
        "phone": "+49 517 529 6426"
    },
    {
        "letter": "S",
        "name": "Stephanie Davis",
        "initials": "SD",
        "email": "jamesramsey@levine-jones.com",
        "phone": "+49 183 513 6865"
    },
    {
        "letter": "W",
        "name": "William Blackwell",
        "initials": "WB",
        "email": "alison96@gmail.com",
        "phone": "+49 704 051 2075"
    }
];
