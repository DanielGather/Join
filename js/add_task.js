function handleSubmit(event) {   // prüfen welcher button geklickt wurde
    event.preventDefault();
    const submitButton = event.submitter;    
    if (submitButton.id === "clear") {
        clear(); 
    } else if (submitButton.id === "createTask") {
        createTask(); 
    }   
    return false;
}


function clear() {
    console.log("clear test test"); 
}


function createTask() {
    console.log("createTask test test");
}


function toggleAssignedToDropDown() {
    let imgDropdownToggle = document.getElementById('imgDropdownToggle');
    let dropdownMenu = document.getElementById('dropDownMenu');
    if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'flex';
        imgDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    } else {
        dropdownMenu.style.display = 'none';
        imgDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    }
}