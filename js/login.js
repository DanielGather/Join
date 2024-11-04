function changeImageWhenClickInputfield() {
    let image = document.getElementById('lockImage');
    image.src = "./assets/img/visibility_off.svg";
    let container = document.getElementById('input-password-container');
    container.classList.add('light-blue-border');
}


function makePasswordVisible() {
    let passwordInput = document.getElementById('passwordInput');
    let image = document.getElementById('lockImage');
    if (image.src.includes("visibility_off.svg")) {
        image.src = "./assets/img/visibility.svg";
        passwordInput.type = "text";
    } else {
        image.src = "./assets/img/visibility_off.svg";
        passwordInput.type = "password";
    }
}

