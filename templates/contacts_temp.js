function temp_letterContainer(letter) {
    return /*html*/`
        <div id="containerOfLetter_${letter}">
            <div class="contacts-letter">
                <h3>${letter}</h3>
            </div>
            <div class="contact-letter-seperator"></div>
            <div id="contactsOf_${letter}"></div>
        </div>
    `
}

function temp_contactCard(contact) {
    return /*html*/`
        <div class="contact-s-card">
            <div class="contact-img-container">
                <div class="contacts-profil-elipse">${contact.initials}</div>
            </div>
            <div class="contact-details">
                <h3>${contact.name}</h3>
                <a class="e-mail" href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
    `
}
