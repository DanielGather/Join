window.addEventListener('resize', closeMobileModal);

let editId;

async function contactsJS() {
    await updateLS();
    renderContactsLetter();

}

function renderContactsLetter() {
    document.getElementById('renderContainer_contacts').innerHTML = '';
   
    let currentLetter = null;
    for (let i = 0; i < contactsLS.length; i++) {
        const id = contactsLS[i][0];
        const contact = contactsLS[i][1];
        
        if (contact.letter !== currentLetter) {
            currentLetter = contact.letter;
            document.getElementById('renderContainer_contacts').innerHTML += temp_letterContainer(contact.letter);
            renderContactCards(id, contact);
        } else {
            renderContactCards(id, contact);
        }
    }
}

function renderContactCards(id, contact) {
    document.getElementById(`contactsOf_${contact.letter}`).innerHTML += temp_contactCard(id, contact);
    coloringProfImg(id, contact);
}

function coloringProfImg(id, contact) {
    document.getElementById(`color${id}`).style.backgroundColor = contact.color;
}

function coloringInfoProfImg(id, contact) {
    document.getElementById(`colorInfo${id}`).style.backgroundColor = contact.color;
}

function viewContact(id) {
    removeActiveLink('.contact-s-card', 'active-contact');
    document.getElementById(`cardContact${id}`).classList.add('active-contact');
    
    document.getElementById('secContacts').classList.add('hide-mobile');
    document.getElementById('secViewContact').classList.remove('hide-mobile');
    renderContactInfos(id);
    document.getElementById('mobileMenuDialog').innerHTML = temp_mobileMenu(id);
}

function renderContactInfos(id) {
    let contact = idToContact(id);

    document.getElementById('sec_contactInfo').innerHTML = temp_contactInfo(id, contact);
    coloringInfoProfImg(id, contact);
}

function idToContact(id) {
    let contactArr = contactsLS.filter(contact => contact[0] == id);
    let contact = contactArr[0][1];
    return contact;
}

function getInpValues(nameId, mailId, phoneId) {
    let mail = document.getElementById(mailId).value.trim();
    let phone = document.getElementById(phoneId).value.trim();
    let name = document.getElementById(nameId).value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, function(match) {return match.toUpperCase();});

    clearInputs();
    return {'name': name, 'email': mail, 'phone': phone};
}

function clearInputs() {
    document.querySelectorAll('input').forEach(input => input.value = '');
}

async function openNewContact(id) {
    await contactsJS();
    viewContact(id);
    renderContactInfos(id);
}

async function addContact(event) {
    event.preventDefault();

    let newContact = getInpValues('inpName', 'inpMail', 'inpPhone');
    newContact.initials = createInitials(newContact.name);
    newContact.letter = newContact.name.charAt(0).toUpperCase();
    newContact.color = getRandomColor();
    
    let response = await postData('contacts', newContact);
    
    let id = response.name;
    
    closeModal('addContactDialog');
    await openNewContact(id);
}

function fillInputs(id) {
    let contact = idToContact(id);
    document.getElementById('editName').value = contact.name;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editPhone').value = contact.phone || '';
}

function showEditImg(id) {
    let contact = idToContact(id);
    document.getElementById('editContactImg').innerHTML = contact.initials;
    document.getElementById('editContactImg').style.backgroundColor = contact.color;
}

function realTimeInitial() {
    let input = document.getElementById('editName').value.trim();
    let initials = createInitials(input);
    document.getElementById('editContactImg').innerHTML = initials;
}

function openEditContact(id) {
    editId = id;
    openModal('editContactDialog');
    deleteButtonModal(id);
    fillInputs(id);
    showEditImg(id);
}

async function saveEdit(event) {
    event.preventDefault();
    let contact = idToContact(editId);

    let editContact = getInpValues('editName', 'editEmail', 'editPhone');
    editContact.initials = createInitials(editContact.name);
    editContact.letter = editContact.name.charAt(0).toUpperCase();
    editContact.color = contact.color;
    if (contact.password) {editContact.password = contact.password};

    await putData(`contacts/${editId}`, editContact);
    closeModal('editContactDialog');
    await openNewContact(editId);
}

function deleteButtonModal(id) {
    document.getElementById('modalDeleteButton').onclick = function() {
        closeModal('editContactDialog');
        deleteContact(id);
    };
}

async function deleteContact(id) {
    if (id !== undefined) {
        await deleteData(`contacts/${id}`);
        document.getElementById('sec_contactInfo').innerHTML = '';
        await contactsJS();

        document.getElementById('secContacts').classList.remove('hide-mobile');
        document.getElementById('secViewContact').classList.add('hide-mobile');
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    let classToOpen;
    if (id == 'mobileMenuDialog') {
        classToOpen = 'menu-dialog-slide-right';
    } else {classToOpen = 'open'}
    modal.showModal();
    setTimeout(() => {
        modal.classList.add(classToOpen);
    }, 10);
}
  
function closeModal(id) {
    const modal = document.getElementById(id);
    let classToOpen;
    if (id == 'mobileMenuDialog') {
        classToOpen = 'menu-dialog-slide-right';
    } else {classToOpen = 'open'}
    modal.classList.remove(classToOpen);
    setTimeout(() => {
        modal.close();
    }, 400);
}

function closeMobileModal() {
    if (window.innerWidth >= 1180) {
        closeModal('mobileMenuDialog')
    }
}

function closeOnClickOutside(event, id) {
    const modal = document.getElementById(id);
    // Prüfe, ob das angeklickte Element das Modal selbst ist (außerhalb des Inhalts)
    if (event.target === modal) {
      closeModal(id);
    }
}






let demo = [
    {
        "letter": "A",
        "name": "Adam Green",
        "initials": "AG",
        "email": "adam.green@example.com",
        "phone": "+49 234 567 8901",
        "color": "#FF5EB3"
    },
    {
        "letter": "A",
        "name": "Alice Turner",
        "initials": "AT",
        "email": "alice.turner@example.com",
        "phone": "+49 123 456 7890",
        "color": "#6E52FF"
    },
    {
        "letter": "B",
        "name": "Barbara Evans",
        "initials": "BE",
        "email": "christina16@chandler.info",
        "phone": "+49 078 644 7883",
        "color": "#FFBB2B"
    },
    {
        "letter": "B",
        "name": "Brenda Santana",
        "initials": "BS",
        "email": "trodriguez@gmail.com",
        "phone": "+49 273 910 2805",
        "color": "#0038FF"
    },
    {
        "letter": "C",
        "name": "Christina Adams",
        "initials": "CA",
        "email": "jconner@gmail.com",
        "phone": "+49 907 707 0200",
        "color": "#C3FF2B"
    },
    {
        "letter": "C",
        "name": "Christina Livingston",
        "initials": "CL",
        "email": "tyrone24@rodriguez-flores.com",
        "phone": "+49 328 227 5215",
        "color": "#FC71FF"
    },
    {
        "letter": "D",
        "name": "David Ball",
        "initials": "DB",
        "email": "harrisjacqueline@gonzalez.net",
        "phone": "+49 484 641 1670",
        "color": "#FFBB2B"
    },
    {
        "letter": "G",
        "name": "Glen Smith",
        "initials": "GS",
        "email": "michael56@hotmail.com",
        "phone": "+49 135 876 0422",
        "color": "#FFBB2B"
    },
    {
        "letter": "J",
        "name": "Jamie Lane",
        "initials": "JL",
        "email": "petersalexander@walters.net",
        "phone": "+49 790 631 7169",
        "color": "#FF745E"
    },
    {
        "letter": "K",
        "name": "Kevin Smith",
        "initials": "KS",
        "email": "brooksmichael@hotmail.com",
        "phone": "+49 769 196 7735",
        "color": "#462F8A"
    },
    {
        "letter": "K",
        "name": "Kevin Taylor",
        "initials": "KT",
        "email": "michaelrose@gmail.com",
        "phone": "+49 512 891 7581",
        "color": "#9327FF"
    },
    {
        "letter": "M",
        "name": "Michelle Howard",
        "initials": "MH",
        "email": "woodskatherine@yahoo.com",
        "phone": "+49 589 838 4401",
        "color": "#9327FF"
    },
    {
        "letter": "R",
        "name": "Randy Morgan",
        "initials": "RM",
        "email": "aescobar@kelley.com",
        "phone": "+49 533 793 8174",
        "color": "#FFBB2B"
    },
    {
        "letter": "S",
        "name": "Samantha Berg",
        "initials": "SB",
        "email": "kharris@yahoo.com",
        "phone": "+49 229 785 1555",
        "color": "#FC71FF"
    },
    {
        "letter": "S",
        "name": "Shawn Spears",
        "initials": "SS",
        "email": "padillalori@perez.org",
        "phone": "+49 517 529 6426",
        "color": "#C3FF2B"
    },
    {
        "letter": "S",
        "name": "Stephanie Davis",
        "initials": "SD",
        "email": "jamesramsey@levine-jones.com",
        "phone": "+49 183 513 6865",
        "color": "#FFE62B"
    },
    {
        "letter": "W",
        "name": "William Blackwell",
        "initials": "WB",
        "email": "alison96@gmail.com",
        "phone": "+49 704 051 2075",
        "color": "#6E52FF"
    }
]
    

function adAllContacts(list) {
    list.forEach(element => postData('contacts', element))
}
