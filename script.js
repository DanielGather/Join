const BASE_URL = 'https://join-cf048-default-rtdb.europe-west1.firebasedatabase.app/';

let userId;
let userInfo;
let contactsLS = [];
let contactsOnly = [];
const colors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B', '#462F8A'
];

document.dispatchEvent(new Event('dataLoaded'));

async function init(html) {
    if (checkLoginStatus()) {
        
        await updateLS();
        loadUser();
        
        renderHeader(html);
        renderNavBar(html);
        
        if (html == 'board') {
            boardJS();
        } else if (html == 'contacts') {
            contactsJS();
        }
    }
}


function renderNavBar(html) {
    document.getElementById('navBar').innerHTML = navbarTemplate();
    removeActiveLink('.nav-links a', 'nav-active');
    removeActiveLink('.copyright-links a', 'copyright-activ');
    
    if (html == 'help') {
        return;
    };

    let className = 'nav-active';
    if (html == 'privacyPolicy' || html == 'legalNotice') {
        className = 'copyright-activ';
        if (localStorage.getItem('logIn')) {
            document.getElementById('').display = 'none';
        }
    }

    document.getElementById(`${html}Link`).classList.add(className);
}

function removeActiveLink(selectElements, className) {
    document.querySelectorAll(selectElements).forEach(element => {
        if (element.classList.contains(className)) {
          element.classList.remove(className);
        }
    });
}

function renderHeader(html = '') {
    let initials = getUserInitials() || 'G';
    document.getElementById('header').innerHTML = returnHeaderHtml(initials);
    
    if (html == 'help') {
        return hideHelpButton();
    };
    
    if (html == 'privacyPolicy' || html == 'legalNotice') {
        return hideHeaderButtons();
    }
}

function hideHelpButton() {
    document.getElementById('helpButton').style.display = 'none';
}

function hideHeaderButtons() {
    document.getElementById('headerButtonsContainer').style.display = 'none';
}

function showPopUp(){
    document.getElementById("popUp").classList.toggle("d-none");
}

async function updateLS() {
    let contactsArr = await getWhoelParthArr('contacts')
    let sortetContacts = sortArrayContacts(contactsArr);
    contactsLS = sortetContacts;
    for (let i = 0; i < sortetContacts.length; i++) {
        contactsOnly.push(sortetContacts[i][1])
    }
}

async function getWhoelParthArr(path) {
    let responseJson = await getData(path);
    let whoelParthArr = Object.entries(responseJson);
    return whoelParthArr;
}

function sortArrayContacts(contactsArr) {
    const sortedArray = contactsArr.sort((a, b) => {
        const nameA = a[1].name.toLowerCase();
        const nameB = b[1].name.toLowerCase();
      
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1; 
        return 0;
    });
    return sortedArray;
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

/**
 * 
 * @param {string} path 
 * @param {string} key 
 * @param {string} includeValue 
 * @returns string
 */
async function getIdFromDb(path, key, includeValue) {
    let contactsPath = await getData(path);

    let allEntiesArr = Object.entries(contactsPath);
    let searchElement = allEntiesArr.filter(element => element[1][key] == includeValue);
    let searchId = searchElement[0][0];
    return searchId;
}

function createInitials(name) {
    let nameParts = name.split(/\s+/);
    let initials = nameParts[0].charAt(0).toUpperCase();
    
    if (nameParts.length > 1) {
        initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    } else {
        initials += nameParts[0].charAt(1).toUpperCase();
    }
    return initials;
}

function getUsageColors() {
    let colorUsage = colors.reduce((acc, color) => {
        acc[color] = 0;
        return acc;
    }, {});
    
    contactsOnly.forEach(contact => colorUsage[contact.color] ++);
    return colorUsage;
}

function getRandomColor() {
    let colorUsage = getUsageColors();
    const weightedColors = [];
    
    colors.forEach(color => {
        const usageCount = colorUsage[color];
        const weight = Math.max(5 - usageCount, 1);
        for (let i = 0; i < weight; i++) {
            weightedColors.push(color);
        }
    });

    // Wähle eine zufällige Farbe aus dem gewichteten Array
    const randomColor = weightedColors[Math.floor(Math.random() * weightedColors.length)];
    return randomColor;
}




// USER
function loadUser() {
    userId = localStorage.getItem("user");
    if (userId == 'guest') {
        userInfo = 'guest';
    } else {
        let user = getUserFromContacts(userId);
        userInfo = user[1];
    }
}

function getUserFromContacts(id) {
    let user = contactsLS.find(contact => contact[0] == id);
    return user;
}

function getUserInitials() {
    return userInfo.initials;
}

// MUSS vor jeder Seite ausgeführt werden außer index & privatePolicy
function checkLoginStatus() {
    let user = localStorage.getItem("user");
    let logIn = localStorage.getItem("logIn") == "true";

    if (!logIn) {
        window.location.href = "./index.html";
    } else {
        console.log("User ist eingeloggt", user);
        return true;
    }
}

function logOut() {
    let remember = localStorage.getItem("remember") == "true";
    localStorage.removeItem('logIn');
    if (!remember) {localStorage.removeItem('user')}
}

// TODO: feghler:
// render index
