/**
 * Converts a date string from the format `DD.MM.YYYY` to `YYYY-MM-DD`.
 * This function is useful for transforming date formats, such as those retrieved
 * from a Firebase database, into a standardized ISO 8601 format.
 * @param {string} fireBaseDate - The date string in `DD.MM.YYYY` format to be converted.
 * @returns {string} The formatted date string in `YYYY-MM-DD` format.
 */
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

/**
 * Converts a date string or object to the German date format `DD.MM.YYYY`.
 * The function accepts a date string or a `Date` object and formats it
 * to a human-readable German format using the `toLocaleDateString` method.
 * @param {string|Date} wrongFormat - The input date in any format parsable by JavaScript's `Date` object.
 * @returns {string} The formatted date string in `DD.MM.YYYY` format.
 */
function changeTimeFormat(wrongFormat) {
  let dateInput = wrongFormat;
  let date = new Date(dateInput);
  let rightFormat = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  return rightFormat;
}

/**
 * Highlights the correct priority for a given task.
 * Based on the task's priority, it sets the appropriate button color in the "Edit" mode.
 * @param {Object} rightTask - The task object containing the priority information.
 * @param {string} rightTask.priority - The priority level of the task (e.g., "low", "medium", "high").
 */
function highlightRightPriority(rightTask) {
  let priority = rightTask.priority;
  setButtonColorForPrio(priority, "Edit");
}

/**
 * Stops the propagation of an event.
 * This prevents the event from bubbling up or capturing down the DOM tree,
 * ensuring that only the current target handles it.
 * @param {Event} event - The event object whose propagation is to be stopped.
 */
function eventStopPropagation(event) {
  event.stopPropagation();
}

/**
 * Assigns the appropriate priority image to the task container based on its priority level.
 * Dynamically determines the container ID and sets the correct priority image
 * (low, medium, or urgent) as its content.
 * @param {Object[]} element - The task element, an array where the second item is an object containing task data.
 * @param {string} element[1].id - The unique identifier for the task.
 * @param {string} element[1].priority - The priority level of the task (e.g., "low", "medium", "urgent").
 */
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

/**
 * Focuses and selects the content of an input field based on its ID.
 * This function finds the input field by appending "_input" to the provided ID,
 * then focuses and selects the text within the input field.
 * @param {string} id - The ID of the input field (without the "_input" suffix).
 */
function focusInputField(id) {
  let inputField = document.getElementById(`${id}_input`);
  inputField.focus();
  inputField.select();
}

/**
 * Checks if the provided list of tasks is empty, and displays a "no results" message if true.
 * If the `filteredTasks` array has no elements, it will show a message by changing the `display` style
 * of the corresponding element with the given `id`.
 * @param {Object[]} filteredTasks - The array of filtered tasks to be checked.
 * @param {string} id - The ID of the element that will display the "no results" message.
 */
function checkInputValueExist(filteredTasks, id) {
  if (filteredTasks.length == 0) {
    document.getElementById(`${id}NoResultsMessage`).style.display = "block";
  }
}

/**
 * Searches for tasks that match the input string in either the headline or description.
 * Filters the tasks based on whether the `headline` or `description` contains the input string,
 * and adds the matching tasks to the `searchedTask` array. If no tasks are found,
 * it triggers the display of a "no results" message.
 * @param {string} input - The search string used to filter tasks by their headline or description.
 * @param {string} id - The ID of the element where the "no results" message will be shown if no tasks match.
 */
function searchRightTask(input, id) {
  searchedTask = [];
  let filteredTasks = allToDos.filter((task) => task[1]["headline"].toLowerCase().includes(input) || task[1]["description"].toLowerCase().includes(input));
  checkInputValueExist(filteredTasks, id);
  filteredTasks.forEach((element) => searchedTask.push(element));
}

/**
 * Retrieves and sanitizes the value of an input field by trimming whitespace and converting the text to lowercase.
 * This function returns the cleaned input value from the specified input field.
 * @function checkInput
 * @param {string} id - The ID of the input field whose value is to be retrieved.
 * @returns {string} The sanitized, lowercase value of the input field.
 */
function checkInput(id) {
  let inputField = document.getElementById(id);
  let inputValue = inputField.value.trim();
  inputValue = inputValue.toLowerCase();
  return inputValue;
}

/**
 * Checks if elements with the class `.allCategories` contain child nodes.
 * If any of these elements do not have child nodes, a new `div` is created with a message
 * ("No tasks To do") and appended to the element.
 */
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

/**
 * Sets the background color of a task element based on its story type.
 * If the story type is "Technical Task", the background color is set to a specific color.
 * Otherwise, the background color is set to another color. The color is applied to a container
 * element with an ID based on the task's ID and whether the task is a "big" task.
 * @param {Array} element - The task element containing the task data.
 * @param {string} element[1]["story"] - The story type of the task, which determines the background color.
 */
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

/**
 * Returns an array of tasks based on the search results or all tasks.
 * If there are any tasks in the `searchedTask` array, it returns that array.
 * Otherwise, it returns the `allToDos` array, which contains all tasks.
 * @param {Array} allToDos - The array containing all tasks.
 * @returns {Array} An array of tasks, either from `searchedTask` or from `allToDos`.
 */
function getRightArray(allToDos) {
  if (searchedTask.length > 0) {
    let toDoArray = searchedTask;
    return toDoArray;
  } else {
    let toDoArray = allToDos;
    return toDoArray;
  }
}

/**
 * Retrieves a contact object from the `contactsLS` array based on the provided email value.
 * The function searches for a contact whose email matches the provided value, ignoring case differences.
 * Once found, it returns the contact details (the second element of the contact array).
 * @param {string} value - The email address used to search for a contact.
 * @returns {Object} The contact object that matches the provided email address, or `undefined` if no match is found.
 */
function getContact(value) {
  let contact = contactsLS.filter((contact) => contact[1].email.toUpperCase() === value.toUpperCase());
  return contact[0][1];
}

/**
 * Unchecks all checkboxes inside elements with the class `.dropDownContacts`.
 * This function loops through all checkboxes within `.dropDownContacts` and sets each checkbox's `checked` property to `false`.
 */
function uncheckCheckboxen() {
  let checkboxen = document.querySelectorAll(".dropDownContacts input[type='checkbox']");
  checkboxen.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

/**
 * Sets the checkboxes based on the "assignedTo" data of a specific task fetched from Firebase.
 * This function retrieves task data from Firebase, finds the task with the given ID,
 * and checks the checkboxes corresponding to the users assigned to the task.
 * @param {string} taskId - The ID of the task for which the checkboxes should be set.
 */
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

/**
 * Increments a counter stored in `localStorage` by 1 and returns the updated value.
 * If no counter is found in `localStorage`, it initializes it to 0 before incrementing.
 * @returns {number} The updated counter value after incrementing.
 */
function setCounter() {
  let counter = parseInt(localStorage.getItem("counter") || "0", 10);
  counter += 1;
  localStorage.setItem("counter", counter);
  return counter;
}

/**
 * Removes the last 3 digits from the provided text string.
 * If the string has fewer than 3 digits, it removes as many as possible.
 * @param {string} text - The input string from which the last 3 digits will be removed.
 * @returns {string} The input string with the last 3 digits removed.
 */
function removeLastThreeDigits(text) {
  let digit = 2;
  let number = setCounter();
  if (number > 100) {
    digit = 3;
  } else if (number > 1000){
    digit = 4;
  } else if (number > 10000){
    digit = 5;
  }
  const regex = new RegExp(`\\d{${digit}}$`);  // Dynamischer regulärer Ausdruck
  return text.replace(regex, "");
}
