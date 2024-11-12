let summaryToDos;

async function summaryJS() {
  await getAllToDos();
  getSummary("toDo", "summaryToDo");
  getSummary("done", "doneToDo");
  getSummary("inProgress", "progressToDo");
  getSummary("awaitFeedback", "awaitFeedbackToDo");
  checkPriority();
  taskInBoard();
  printDeadlineDate();
  greetRight();
  showRightUser();
}

async function getAllToDos() {
  let data = await getData("toDos");
  summaryToDos = Object.entries(data);
}

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

function checkPriority() {
  let urgent = 0;
  let urgentContainer = document.getElementById("urgentPriority");
  summaryToDos.forEach((toDo) => {
    if (toDo[1].priority === "urgent") {
      urgent++;
    }
  });
  urgentContainer.innerHTML = urgent;
}

function taskInBoard() {
  document.getElementById("lengthTasks").innerHTML = summaryToDos.length;
}

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

function parseDateEuropeDateFormat(dateString) {
  let parts = dateString.split(".");
  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

function formatDate(date) {
  let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

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

function showRightUser(){
  let user = document.getElementById("currentUserLogin");
  console.log("user", userInfo);
  if(userInfo == "quest"){
    user.innerHTML = "Guest";
  } else {
    user.innerHTML = userInfo;
  }
}