let contacts = [
    {
        "letter": "A",
        "name": "Aaron Smith",
        "initials": "AS",
        "email": "aaron.smith@example.com",
        "phone": "+4912345678901"
    },
    {
        "letter": "A",
        "name": "Abigail Jones",
        "initials": "AJ",
        "email": "abigail.jones@example.com",
        "phone": "+4912345678902"
    },
    {
        "letter": "A",
        "name": "Alex Brown",
        "initials": "AB",
        "email": "alex.brown@example.com",
        "phone": "+4912345678903"
    },
    {
        "letter": "B",
        "name": "Ben Taylor",
        "initials": "BT",
        "email": "ben.taylor@example.com",
        "phone": "+4912345678904"
    },
    {
        "letter": "B",
        "name": "Beth Davis",
        "initials": "BD",
        "email": "beth.davis@example.com",
        "phone": "+4912345678905"
    },
    {
        "letter": "C",
        "name": "Chris Miller",
        "initials": "CM",
        "email": "chris.miller@example.com",
        "phone": "+4912345678906"
    },
    {
        "letter": "D",
        "name": "David Wilson",
        "initials": "DW",
        "email": "david.wilson@example.com",
        "phone": "+4912345678907"
    },
    {
        "letter": "E",
        "name": "Ella Moore",
        "initials": "EM",
        "email": "ella.moore@example.com",
        "phone": "+4912345678908"
    },
    {
        "letter": "F",
        "name": "Finn Taylor",
        "initials": "FT",
        "email": "finn.taylor@example.com",
        "phone": "+4912345678909"
    },
    {
        "letter": "G",
        "name": "Grace Anderson",
        "initials": "GA",
        "email": "grace.anderson@example.com",
        "phone": "+4912345678910"
    },
    {
        "letter": "H",
        "name": "Hannah Thomas",
        "initials": "HT",
        "email": "hannah.thomas@example.com",
        "phone": "+4912345678911"
    },
    {
        "letter": "I",
        "name": "Isaac Jackson",
        "initials": "IJ",
        "email": "isaac.jackson@example.com",
        "phone": "+4912345678912"
    },
    {
        "letter": "J",
        "name": "Jack White",
        "initials": "JW",
        "email": "jack.white@example.com",
        "phone": "+4912345678913"
    },
    {
        "letter": "K",
        "name": "Kara Martin",
        "initials": "KM",
        "email": "kara.martin@example.com",
        "phone": "+4912345678914"
    },
    {
        "letter": "L",
        "name": "Liam Garcia",
        "initials": "LG",
        "email": "liam.garcia@example.com",
        "phone": "+4912345678915"
    },
    {
        "letter": "M",
        "name": "Mia Martinez",
        "initials": "MM",
        "email": "mia.martinez@example.com",
        "phone": "+4912345678916"
    },
    {
        "letter": "N",
        "name": "Nina Robinson",
        "initials": "NR",
        "email": "nina.robinson@example.com",
        "phone": "+4912345678917"
    },
    {
        "letter": "O",
        "name": "Olivia Clark",
        "initials": "OC",
        "email": "olivia.clark@example.com",
        "phone": "+4912345678918"
    },
    {
        "letter": "P",
        "name": "Paul Lewis",
        "initials": "PL",
        "email": "paul.lewis@example.com",
        "phone": "+4912345678919"
    },
    {
        "letter": "Q",
        "name": "Quinn Walker",
        "initials": "QW",
        "email": "quinn.walker@example.com",
        "phone": "+4912345678920"
    }
]


async function contactsJS() {
    await renderContactsLetter();
    // await renderContactCards();
}

async function renderContactsLetter() {
    console.log('NOTIZ: Vor dem rendern sollten die Kontakte in eine Lokale variable gespeichert und sortiert werden!');
    let currentLetter = null;

    contacts.forEach(contact => {
        if (contact.letter !== currentLetter) {
            currentLetter = contact.letter;
            document.getElementById('secContacts').innerHTML += temp_letterContainer(contact.letter);
            renderContactCards(contact);
        } else {
            renderContactCards(contact);
        }

    })
}

async function renderContactCards(contact) {
    document.getElementById(`contactsOf_${contact.letter}`).innerHTML += temp_contactCard(contact);
}
