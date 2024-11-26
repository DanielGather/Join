/**
 * Toggles the visibility of the "Assigned To" dropdown menu and updates the dropdown toggle icon.
 * 
 * This function is responsible for showing or hiding the "Assigned To" dropdown menu by toggling the `d-none` class 
 * on the dropdown element. Additionally, it updates the icon of the dropdown toggle button (`imgDropdownToggle`) 
 * to either a downward or upward arrow, depending on whether the dropdown menu is visible or hidden.
 * It also calls the `renderAssignedToContacts()` function to ensure the assigned contacts are rendered when the dropdown is opened.
 * 
 * @returns {void} This function does not return a value but modifies the DOM by toggling the dropdown visibility and updating the icon.
 */
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

/**
 * Toggles the visibility of the category dropdown menu and updates the dropdown toggle icon.
 * 
 * This function is responsible for showing or hiding the category dropdown menu by toggling the `d-none` class 
 * on the dropdown element. It also updates the icon of the category dropdown toggle button (`imgCategoryDropdownToggle`) 
 * to either a downward or upward arrow, depending on whether the dropdown menu is visible or hidden.
 * 
 * @returns {void} This function does not return a value but modifies the DOM by toggling the dropdown visibility and updating the icon.
 */
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