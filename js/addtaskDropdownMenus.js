async function toggleAssignedToDropDown() {
    renderAssignedToContacts();
    let imgDropdownToggle = document.getElementById('imgDropdownToggle');
    let dropdownMenu = document.getElementById('dropDownMenu');
    dropdownMenu.classList.toggle('d-none');  
    if (dropdownMenu.classList.contains('d-none')) {
        imgDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    } else {
        imgDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    }
}


function toggleCategoryDropDown() {
    let imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    let categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    categoryDropdownMenu.classList.toggle('d-none');
    if (categoryDropdownMenu.classList.contains('d-none')) {
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    } else {
        imgCategoryDropdownToggle.src = './assets/img/arrow_drop_up.svg';
    }
}