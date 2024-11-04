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

function changeTimeFormat(wrongFormat){
  let dateInput = wrongFormat;
  let date = new Date(dateInput);
  let rightFormat = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  return rightFormat;  
}

function svgColors(rightTask) {
  let svgId = rightTask.priority == "urgent" ? "svgUrgent" : rightTask.priority == "medium" ? "svgMedium" : rightTask.priority == "low" ? "svgLow" : "";
  let svgContainer = document.getElementById(`${svgId}`);
  svgContainer.removeAttribute("class");
}

function highlightRightPriority(rightTask) {
  let urgentId = document.getElementById("urgent");
  let mediumId = document.getElementById("medium");
  let lowId = document.getElementById("low");
  let backgroundColorPriority = rightTask.priority == "urgent" ? "#f33d00" : rightTask.priority == "medium" ? "#ffa800" : rightTask.priority == "low" ? "#7ae228" : "";
  let priority = rightTask.priority == "urgent" ? urgentId : rightTask.priority == "medium" ? mediumId : rightTask.priority == "low" ? lowId : "";
  priority.style.backgroundColor = backgroundColorPriority;
  priority.style.color = "white";
  svgColors(rightTask);
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
  let inputField = document.getElementById(`${id.id}_input`);
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

function getAssignedBackgroundColor(key,value){
  let contact = 
  contactsLS.filter((contact) => contact[1].name.toUpperCase() === key.toUpperCase() && contact[1].initials.toUpperCase() === value.toUpperCase());
  console.log("kontakt testen", contact);
  return  contact[0][1].color;
}

function returnNewSubTaskHtml(subTaskValue, subTaskContainer){
  return /*HTML*/`
  <ul id="${subTaskValue}" class="subTaskList subTaskHover">
  <li id="${subTaskValue}_edit" contenteditable="false">${subTaskValue}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask(${subTaskValue},'edit')" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask(${subTaskValue})" src="./assets/img/delete.svg" alt="">
        </div>
</ul>
  `
}