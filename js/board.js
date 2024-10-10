let currentDraggedElement;

function boardJS() {
  renderBoard();
  navbarTemplate();
  updateHTML();
}

// TODO: SubTask berechnung durchführen für die Progressbar. Assigned To erweitern auf alle ebenen(toDo, inProgress, waitFeedback,done)
// TODO: Mit Team besprechen wo die Varibale generiert wird für die  Task ob es eine UserStory oder eine TechnicalTask ist.
// TODO: Priorität aus dem Backend abfragen dann vergleichen und entsprechendes Img laden.
// TODO: Function komplett reduzieren. Einzelen Aufgaben auslagern und in separate funktionen schreiben.

async function updateHTML() {
  let toDos = await getData("toDos");
  let allToDos = Object.entries(toDos);
  const categories = [
    { name: "toDo", containerId: "toDo" },
    { name: "inProgress", containerId: "inProgress" },
    { name: "awaitFeedback", containerId: "awaitFeedback" },
    { name: "done", containerId: "done" },
  ];
  categories.forEach((category) => updateCategoryHTML(category.name, category.containerId, allToDos));
}

function updateCategoryHTML(category, containerId, allToDos) {
  let filteredToDos = allToDos.filter((t) => t[1]["category"] === category);
  if (filteredToDos.length === 0) return;
  document.getElementById(containerId).innerHTML = "";
  filteredToDos.forEach((element) => {
    document.getElementById(containerId).innerHTML += htmlTechnicalTaskSmall(element);
    let assignedToKeys = Object.entries(element[1]["assignedTo"] || {});
    assignedToKeys.forEach(([key, value]) => {
      document.getElementById(`assignedTo${element[1]["id"]}`).innerHTML += /*HTML*/ `
        <div class="smallCircleUserStory">
          ${value}
        </div>
      `;
    });
  });
}

// async function updateHTML() {
//   let toDos = await getData("toDos");
//   // console.log("Check Datenbank", toDos);
//   let allToDos = Object.entries(toDos);
//   // console.log("Zweiter Check", allToDos);
//   // console.log("Test", allToDos[0][1].description);
//   // fireBaseDataToDo(allToDos);

//   let toDo = allToDos.filter((t) => t[1]["category"] == "toDo");
//   // console.log(toDo);
//   if (toDo.length !== 0) {
//     document.getElementById("toDo").innerHTML = "";
//     for (let index = 0; index < toDo.length; index++) {
//       let element = toDo[index];
//       document.getElementById("toDo").innerHTML += htmlTechnicalTaskSmall(element, index);
//       // if (element[1]["assignedTo"]) {
//         let assignedToKeys = Object.entries(element[1]["assignedTo"]);

//         for (let j = 0; j < assignedToKeys.length; j++) {
//           document.getElementById(`assignedTo${element[1]['id']}`).innerHTML += /*HTML*/ `
//                       <div class="smallCircleUserStory">
//                           ${assignedToKeys[j][1]}
//                       </div>
//                   `;
//         // }
//         // console.log("Element:", element); // Zum Debuggen
//       }
//     }
//   }

//   let progress = allToDos.filter((t) => t[1]["category"] == "inProgress");
//   if (progress.length !== 0) {
//     document.getElementById("inProgress").innerHTML = "";
//     for (let index = 0; index < progress.length; index++) {
//       const element = progress[index];
//       document.getElementById("inProgress").innerHTML += htmlTechnicalTaskSmall(element);

//       let assignedToKeys = Object.entries(element[1]["assignedTo"]);

//         for (let j = 0; j < assignedToKeys.length; j++) {
//           document.getElementById(`assignedTo${element[1]['id']}`).innerHTML += /*HTML*/ `
//                       <div class="smallCircleUserStory">
//                           ${assignedToKeys[j][1]}
//                       </div>
//                   `;
//         // }
//         // console.log("Element:", element); // Zum Debuggen
//       }
//     }
//   }

//   let feedback = allToDos.filter((t) => t[1]["category"] == "awaitFeedback");
//   if (feedback.length !== 0) {
//     document.getElementById("awaitFeedback").innerHTML = "";
//     for (let index = 0; index < feedback.length; index++) {
//       const element = feedback[index];
//       document.getElementById("awaitFeedback").innerHTML += htmlTechnicalTaskSmall(element);

// let assignedToKeys = Object.entries(element[1]["assignedTo"]);

//         for (let j = 0; j < assignedToKeys.length; j++) {
//           document.getElementById(`assignedTo${element[1]['id']}`).innerHTML += /*HTML*/ `
//                       <div class="smallCircleUserStory">
//                           ${assignedToKeys[j][1]}
//                       </div>
//                   `;
//         // }
//         // console.log("Element:", element); // Zum Debuggen
//       }

//     }
//   }

//   let done = allToDos.filter((t) => t[1]["category"] == "done");
//   if (done.length !== 0) {
//     document.getElementById("done").innerHTML = "";
//     for (let index = 0; index < done.length; index++) {
//       const element = done[index];
//       document.getElementById("done").innerHTML += htmlTechnicalTaskSmall(element);

//       let assignedToKeys = Object.entries(element[1]["assignedTo"]);

//         for (let j = 0; j < assignedToKeys.length; j++) {
//           document.getElementById(`assignedTo${element[1]['id']}`).innerHTML += /*HTML*/ `
//                       <div class="smallCircleUserStory">
//                           ${assignedToKeys[j][1]}
//                       </div>
//                   `;
//         // }
//         // console.log("Element:", element); // Zum Debuggen
//       }

//     }
//   }
// }

function fireBaseDataToDo(allToDos) {
  let toDo = allToDos.filter((t) => t[1]["category"] == "toDo");
  // console.log(toDo);
  if (toDo.length !== 0) {
    document.getElementById("toDo").innerHTML = "";
    for (let index = 0; index < toDo.length; index++) {
      let element = toDo[index];
      document.getElementById("toDo").innerHTML += htmlTechnicalTaskSmall(element);
      // if (element[1]["assignedTo"]) {
      let assignedToKeys = Object.entries(element[1]["assignedTo"]);

      for (let j = 0; j < assignedToKeys.length; j++) {
        document.getElementById(`assignedTo${element[1]["id"]}`).innerHTML += /*HTML*/ `
                      <div class="smallCircleUserStory">
                          ${assignedToKeys[j][1]}
                      </div>
                  `;
        // }
        // console.log("Element:", element); // Zum Debuggen
      }
    }
  }
}

function renderBoard() {
  let htmlContent = document.getElementById("main");
  let headerContent = document.getElementById("header");
  htmlContent.innerHTML = boardHtml();
  headerContent.innerHTML = returnHeaderHtml();
}

// function renderToDo(element) {
//   let htmlToDo = document.getElementById("toDo");
//   htmlToDo.innerHTML = "";
//   htmlToDo.innerHTML = htmlTechnicalTaskSmall(element);
// }

function startDraggin(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveToCategory(category) {
  let id = await getIdFromDb("/toDos", "id", currentDraggedElement);
  console.log(id[0]);
  putData("/toDos/" + id[0] + "/category", category);
  await updateHTML();
  boardJS();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

// Sicherung ToDos anlegen
// await postData('/toDos',{headline:'Kochwelt Page & Recipe Recommender', id: 1, category:'done', description:'Build start page with recipe recommendation', assignedTo: {user1: 1, user2: 2, user3: 3}, subtasks:{task1: 1, task2: 2}, priority: 'medium', date: 'Datum', story: {userStory: 'User Story', technicalTask:'Technical Task'}})
