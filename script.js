const BASE_URL = 'https://join-cf048-default-rtdb.europe-west1.firebasedatabase.app/';

let userId = '-O9LX4TBR5QazOMqtHn';
let contactsLS = [];
let contactsOnly = [];
const colors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B', '#462F8A'
];

document.dispatchEvent(new Event('dataLoaded'));

async function init(html) {
    await updateLS();
    renderHeader(html);
    renderNavBar(html);
    // await getIdFromDb('contacts', 'name', 'Finn Taylor');
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

function hideHelpButton() {
    document.getElementById('helpButton').style.display = 'none';
}

function hideHeaderButtons() {
    document.getElementById('headerButtonsContainer').style.display = 'none';
}

function renderHeader(html = '') {
    let user = contactsLS.filter(contact => contact[0] == userId);
    let userProfil = undefined//user[0][1].initials;
    if (userProfil == undefined) {userProfil = 'G'}
    document.getElementById('header').innerHTML = returnHeaderHtml(userProfil);

    if (html == 'help') {
        return hideHelpButton();
    };

    if (html == 'privacyPolicy' || html == 'legalNotice') {
        return hideHeaderButtons();
    }
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

function saveUser() {
    localStorage.setItem("userID", userId);
}

function loadUser() {
    userId = localStorage.getItem("userID");
}