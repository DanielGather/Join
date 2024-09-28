function init(html) {
    renderNavBar(html);
    renderHeader();
}

function renderNavBar(html) {
    document.getElementById('navBar').innerHTML = navbarTemplate();
    removeActiveLink();
    document.getElementById(`${html}Link`).classList.add('nav-active');
}

function removeActiveLink() {
    document.querySelectorAll('.nav-links a').forEach(element => {
        if (element.classList.contains('nav-active')) {
          element.classList.remove('nav-active');
        }
    });      
}

function renderHeader() {
    document.getElementById('header').innerHTML = returnHeaderHtml();
}
