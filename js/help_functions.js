function getRightTimeValue(fireBaseDate) {
  const switchDate = fireBaseDate;
  const [fireBaseDay, fireBaseMonth, fireBaseYear] = switchDate.split(".");
  const newDate = `${fireBaseYear}.${fireBaseMonth}.${fireBaseDay}`;
  const rawDate = new Date(newDate); // Datum aus der Datenbank holen
  const year = rawDate.getFullYear();
  const month = String(rawDate.getMonth() + 1).padStart(2, "0"); // Monat +1, weil Monate bei 0 beginnen
  const day = String(rawDate.getDate()).padStart(2, "0"); // Tag formatieren
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function changeTimeFormat(wrongFormat) {
  let dateInput = wrongFormat;
  let date = new Date(dateInput);
  let rightFormat = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  return rightFormat;
}

// function svgColors(rightTask) {
//   let svgId = rightTask.priority == "urgent" ? "svgUrgent" : rightTask.priority == "medium" ? "svgMedium" : rightTask.priority == "low" ? "svgLow" : "";
//   let svgContainer = document.getElementById(`${svgId}`);
//   svgContainer.removeAttribute("class");
// }

function highlightRightPriority(rightTask) {
  let priority = rightTask.priority;
  setButtonColorForPrio(priority, "Edit");
}

function eventStopPropagation(event) {
  event.stopPropagation();
}

function getRightPriority(element) {
  let containerId = element[1]["id"];
  let taskPriority = element[1]["priority"];
  let lowPriority = "./assets/img/prio_low.svg";
  let mediumPriority = "./assets/img/prio_medium.svg";
  let urgentPriority = "./assets/img/prio_urgent.svg";
  let priorityImg = taskPriority === "low" ? lowPriority : taskPriority === "medium" ? mediumPriority : urgentPriority;
  if (bigTaskActive) {
    containerId = `bigPriority${element[1]["id"]}`;
  } else {
    containerId = `priority${element[1]["id"]}`;
  }
  document.getElementById(containerId).innerHTML = `<img src="${priorityImg}"/>`;
}

function focusInputField(id) {
  let inputField = document.getElementById(`${id}_input`);
  inputField.focus();
  inputField.select();
}

function checkInputValueExist(filteredTasks, id) {
  if (filteredTasks.length == 0) {
    document.getElementById(`${id}NoResultsMessage`).style.display = "block";
  }
}

function searchRightTask(input, id) {
  searchedTask = [];
  let filteredTasks = allToDos.filter((task) => task[1]["headline"].toLowerCase().includes(input) || task[1]["description"].toLowerCase().includes(input));
  checkInputValueExist(filteredTasks, id);
  filteredTasks.forEach((element) => searchedTask.push(element));
}

function checkInput(id) {
  let inputField = document.getElementById(id);
  let inputValue = inputField.value.trim();
  inputValue = inputValue.toLowerCase();
  return inputValue;
}

function checkChildElement() {
  let elements = document.querySelectorAll(".allCategories");
  elements.forEach((element) => {
    if (!element.hasChildNodes()) {
      let createDiv = document.createElement("div");
      createDiv.className = "noTask d-flex alic jc-c colorGrey fs16";
      createDiv.textContent = "No tasks To do";
      element.appendChild(createDiv);
    }
  });
}

function getRightUserColor(element) {
  let colorStory = element[1]["story"];
  let containerId;
  if (bigTaskActive) {
    containerId = `bigStory${element[1]["id"]}`;
  } else {
    containerId = `story${element[1]["id"]}`;
  }
  if (colorStory === "Technical Task") {
    document.getElementById(containerId).style.backgroundColor = "#1fd7c1";
  } else {
    document.getElementById(containerId).style.backgroundColor = "#0038ff";
  }
}

function getRightArray(allToDos) {
  if (searchedTask.length > 0) {
    let toDoArray = searchedTask;
    return toDoArray;
  } else {
    let toDoArray = allToDos;
    return toDoArray;
  }
}

function getContact(value) {
  let contact = contactsLS.filter((contact) => contact[1].email.toUpperCase() === value.toUpperCase());
  return contact[0][1];
}

function returnNewSubTaskHtml(subTaskValue, idSubTaskValue, index, taskId) {
  return /*HTML*/ `
  <ul id="${idSubTaskValue}_${index}" class="subTaskList subTaskHover">
  <li id="${idSubTaskValue}_edit" contenteditable="false">${subTaskValue}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask('${idSubTaskValue}','edit',${index}, ${taskId}, '${subTaskValue}')" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask('${idSubTaskValue}', ${index}, ${taskId}, '${subTaskValue}')" src="./assets/img/delete.svg" alt="">
        </div>
</ul>
  `;
}

function uncheckCheckboxen() {
  let checkboxen = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
  checkboxen.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

async function setCheckboxesBasedOnFirebaseData(taskId) {
  let toDos = await getData("toDos");
  allToDos = Object.entries(toDos);
  let task = allToDos.filter((toDo) => toDo[1]["id"] === taskId);
  if (task[0][1]["assignedTo"] !== undefined) {
    let assignedToEntries = Object.entries(task[0][1]["assignedTo"]);
    assignedToEntries.forEach(([, emailId]) => {
      let checkbox = document.getElementById(emailId);
      checkbox.checked = true;
    });
  }
  renderInitials();
}

function setCounter() {
  let counter = parseInt(localStorage.getItem("counter") || "0", 10);
  counter += 1;
  localStorage.setItem("counter", counter);
  return counter;
}
