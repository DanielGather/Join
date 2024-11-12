let summaryToDos;


/**
 * The summaryJS is there to execute all necessary functions during onload.
 * 
 */
async function summaryJS() {
  await getAllToDos();
  getSummary("toDo", "summaryToDo");
  getSummary("done", "doneToDo");
  getSummary("inProgress", "progressToDo");
  getSummary("awaitFeedback", "awaitFeedbackToDo");
  howManyUrgentTasks();
  taskInBoard();
  printDeadlineDate();
  greetRight();
  showRightUser();
}

/**
 * with getAllToDos I get the current ToDos from the database (Firebase)
 * 
 * @param {string} summaryToDos - summaryToDos is a global variable where I store all tasks that are in Firebase.
 */
async function getAllToDos() {
  let data = await getData("toDos");
  summaryToDos = Object.entries(data);
}

/**
 * I use getSummary to get the data from the database to show how many ToDos, awaitProgress etc. are available.
 * 
 * @param {string} category - category is used to query which category the task is in
 * @param {string} containerId - The containerId is used to load the content into the correct container.
 */
function getSummary(category, containerId) {
  let count = 0;
  let container = document.getElementById(containerId);
  summaryToDos.forEach((toDo) => {
    if (toDo[1].category === category) {
      count++;
    }
  });
  container.innerHTML = count;
}

/**
 * howManyUrgentTask queries the database to find out how many tasks are urgent and then displays them accordingly in Summary.
 * 
 */
function howManyUrgentTasks() {
  let urgent = 0;
  let urgentContainer = document.getElementById("urgentPriority");
  summaryToDos.forEach((toDo) => {
    if (toDo[1].priority === "urgent") {
      urgent++;
    }
  });
  urgentContainer.innerHTML = urgent;
}

/**
 * taskInBoard only shows how many tasks are in the database.
 * 
 */
function taskInBoard() {
  document.getElementById("lengthTasks").innerHTML = summaryToDos.length;
}

/**
 * Searches for the next upcoming date from the list of tasks and displays it in the HTML element “upcomingDeadline”.
 * 
 * This function iterates through all date values in `summaryToDos`, converts them to a `Date` object, and finds the date
 * closest to the current date. The date is then formatted and displayed in the HTML element with the ID `upcomingDeadline`.
 */
function printDeadlineDate() {
  let currentDate = new Date();
  let nextDate = null;
  let deadlineContainer = document.getElementById("upcomingDeadline");
  summaryToDos.forEach((taskDate) => {
    let date = parseDateEuropeDateFormat(taskDate[1].date);
    if (date > currentDate) {
      if (nextDate === null || date < nextDate) {
        nextDate = date;
      }
    }
  });
  nextDate = formatDate(nextDate);
  deadlineContainer.innerHTML = nextDate;
}

/**
 * Converts a date in the European format "DD.MM.YYYY" into a JavaScript `Date` object.
 * 
 * @param {string} dateString - A date in the format "DD.MM.YYYY", e.g., "25.12.2024".
 * @returns {Date} A `Date` object representing the provided date.
 */
function parseDateEuropeDateFormat(dateString) {
  let parts = dateString.split(".");
  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Formats a JavaScript `Date` object into a readable string with the format "Month Day, Year".
 * 
 * The function converts a given date to a string in the format of "Month Day, Year" (e.g., "February 15, 2023").
 * It uses an array of month names to display the month in full, and extracts the day and year from the provided date.
 * 
 * @param {Date} date - A JavaScript `Date` object to format.
 * @returns {string} A formatted date string in the format "Month Day, Year".
 */
function formatDate(date) {
  let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Displays an appropriate greeting ("Good Morning," "Good Afternoon," or "Good Evening") based on the current time.
 * 
 * This function retrieves the current time and compares it to predefined morning, afternoon, and evening time ranges
 * to determine the correct greeting. The greeting is then displayed in the HTML element with the ID "dayTime".
 */
function greetRight(){
  let container = document.getElementById("dayTime");
  let currentTime =  new Date().toLocaleTimeString();
  let morningTime = "07:00:00";
  let afternoonTime = "12:00:00";
  let eveningTime = "18:00:00"
  let greeting = currentTime > morningTime && currentTime < afternoonTime ? "Good Morning" : currentTime > afternoonTime && currentTime <  eveningTime ? "Good Evening" : "Good Afternoon";
  container.innerHTML = greeting;
  console.log("Uhrzeit",greeting);
}

/**
 * Displays the current user's name or "Guest" if the user is not logged in.
 * 
 * This function checks the value of `userInfo`. If `userInfo` is equal to "quest," it sets the inner HTML of the
 * element with ID "currentUserLogin" to "Guest"; otherwise, it displays the `userInfo` value.
 */
function showRightUser(){
  let user = document.getElementById("currentUserLogin");
  console.log("user", userInfo);
  if(userInfo = "quest"){
    user.innerHTML = "Guest";
  } else {
    user.innerHTML = userInfo;
  }
}