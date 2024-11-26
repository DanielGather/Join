function chooseTaskPrioType(priorityType, idVariable) {
    if (statusPriority === priorityType) {
        setButtonColorForPrio(null, idVariable);
        statusPriority = null;
        return null;
    }
    statusPriority = priorityType;
    setButtonColorForPrio(priorityType, idVariable);
}


function setButtonColorForPrio(priorityType, idVariable) {
    resetButtonStyles(idVariable);
    if (priorityType === null) {
        priorityType = 'medium';
    }
    if (priorityType === "urgent") {
        document.getElementById(`urgentButton${idVariable}`).style.backgroundColor = '#FF3D19';
        document.getElementById(`urgentButton${idVariable}`).style.color = 'white';
        document.getElementById(`urgentButtonImg${idVariable}`).src = './assets/img/prio-urgent-white.svg';
    } else if (priorityType === "medium") {
        document.getElementById(`mediumButton${idVariable}`).style.backgroundColor = '#FFA827';
        document.getElementById(`mediumButton${idVariable}`).style.color = 'white';
        document.getElementById(`mediumButtonImg${idVariable}`).src = './assets/img/prio-medium-white.svg';
    } else if (priorityType === "low") {
        document.getElementById(`lowButton${idVariable}`).style.backgroundColor = '#7AE22B';
        document.getElementById(`lowButton${idVariable}`).style.color = 'white';
        document.getElementById(`lowButtonImg${idVariable}`).src = './assets/img/prio-low-white.svg';
    }
}


function resetButtonStyles(idVariable) {
    document.getElementById(`urgentButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`urgentButton${idVariable}`).style.color = '';
    document.getElementById(`urgentButtonImg${idVariable}`).src = './assets/img/prio_urgent.svg';
    document.getElementById(`mediumButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`mediumButton${idVariable}`).style.color = '';
    document.getElementById(`mediumButtonImg${idVariable}`).src = './assets/img/prio_medium.svg';
    document.getElementById(`lowButton${idVariable}`).style.backgroundColor = '';
    document.getElementById(`lowButton${idVariable}`).style.color = '';
    document.getElementById(`lowButtonImg${idVariable}`).src = './assets/img/prio_low.svg';
}


function setCategory(category) {
    let categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
    let imgCategoryDropdownToggle = document.getElementById('imgCategoryDropdownToggle');
    document.getElementById('category-header').innerText = category;
    categoryDropdownMenu.classList.add('d-none');
    imgCategoryDropdownToggle.src = './assets/img/arrow_drop_down.svg';
    selectedCategory = category;
    checkIfCreateTaskButtonCanBeEnabled();
}