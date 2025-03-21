function boardHtml() {
  return /*HTML*/ `
    <div class="d-flex dflex-col board gap1">
      <div class="boardMobile">
      <div class="d-flex jc-sb" style="align-items:center;">
        <h1 style="font-size: 48px">Board</h1>
        <img onclick="showAddTask()" class="responsiveButton" src="./assets/img/plus.svg" alt="" />
      </div>
      <div class="input-container">
        <input id="mobile" onkeyup="searchTask('mobile')" type="text" style="width: 100%" placeholder="Dein Text" />
        <p id="mobileNoResultsMessage" style="display: none; color: red; position:absolute; top: -25px;">Keine Ergebnisse gefunden</p>
        <div class="icon-container">
          <div class="divider"></div>
          <img class="icon" src="./assets/img/search.svg" alt="" />
        </div>
      </div>
    </div>
      <div class="boardDesktop d-flex jc-sb">
        <h1 style="font-size: 61px">Board</h1>
        <div class="d-flex gap1 alic">
          <div class="input-container">
            <input id="desktop" onkeyup="searchTask('desktop')" type="text" placeholder="Dein Text" />
            <p id="desktopNoResultsMessage" style="display: none; color: red; position:absolute; top: -25px;">Keine Ergebnisse gefunden</p>
            <div class="icon-container">
              <div class="divider"></div>
              <img class="icon" src="./assets/img/search.svg" alt="" />
            </div>
          </div>
          <button onclick="showAddTask('toDo')" class="createTaskButton alic button-dark fs16">Add task<img src="./assets/img/add.svg"></button>
        </div>
      </div>
      <div id="taskArea" class="taskArea d-flex gap1">
        <div class="d-flex dflex-col gap1 toDos">
          <div class="d-flex jc-sb alic">
            <span style="font-family:Inter; font-weight:700; color: #42526E">To Do</span>
            <img onclick="showAddTask('toDo')" class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div ondrop="moveToCategory('toDo')" ondragleave="removeHighlight('toDo')" ondragover="allowDrop(event); highlight('toDo')" id="toDo" class="toDoArea allCategories">
            <div  class="noTask d-flex alic jc-c colorGrey fs16">No tasks To do</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1 toDos">
          <div class="d-flex jc-sb alic">
            <span style="font-family:Inter; font-weight:700; color: #42526E">In progress</span>
            <img onclick="showAddTask('inProgress')" class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div ondrop="moveToCategory('inProgress')" ondragleave="removeHighlight('inProgress')" ondragover="allowDrop(event); highlight('inProgress')" id="inProgress" class="progressArea allCategories">
            <div class="noTask d-flex alic jc-c colorGrey fs16">No tasks in progress</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1 toDos">
          <div class="d-flex jc-sb alic">
            <span style="font-family:Inter; font-weight:700; color: #42526E">Await feedback</span>
            <img onclick="showAddTask('awaitFeedback')" class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div ondrop="moveToCategory('awaitFeedback')" ondragleave="removeHighlight('awaitFeedback')" ondragover="allowDrop(event); highlight('awaitFeedback')" id="awaitFeedback" class="feedbackArea allCategories">
          <div class="noTask d-flex alic jc-c colorGrey fs16">No feedback</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1 toDos">
          <div class="d-flex jc-sb alic" style="height: 30px;">
            <span style="font-family:Inter; font-weight:700; color: #42526E">Done</span>
          </div>
          <div ondrop="moveToCategory('done')" ondragleave="removeHighlight('done')" ondragover="allowDrop(event); highlight('done')" id="done" class="d-flex dflex-col gap1 doneArea allCategories" style="width: 100%;">
            <div class="noTask d-flex alic jc-c colorGrey fs16">Nothing is done</div>
          </div>
        </div>
      </div>
    </div>
    <div id="addTaskBoard" onclick="triggerButton()" class="addTaskContainer">
      <div onclick="eventStopPropagation(event)" class="addTaskBoard" id="boardAddTask"></div>
    </div>
    <div class="landscape-warning">Bitte drehen Sie Ihr Gerät ins Hochformat.</div>
    <div class="popupContainer" id="popupContainer">
                <p id="successText"></p>
                <img src="./assets/img/board-icon.svg" alt="board-icon">
            </div>
    `;
}

function htmlChangeToList(newIdWithOutSpace, newValue, taskId, index) {
  return /*HTML*/ `
  <li id="${newIdWithOutSpace}_edit" contenteditable="false">${newValue}</li>
      <div class="subTaskIcons">
      <img onclick="editSubTask('${newIdWithOutSpace}','edit', ${index},${taskId},'${newValue}' )" src="./assets/img/edit.svg" alt="">
      <div class="seperator"></div>
      <img onclick="deleteSubTask('${newIdWithOutSpace}', ${index}, ${taskId}, '${newValue}')" src="./assets/img/delete.svg" alt="">
      </div>
`;
}

function returnEditableSubTaskHTML(idWithNoSpace, task, value, index, newValue) {
  return /*HTML*/ `
    <ul id="${idWithNoSpace}_${index}" class="subTaskList subTaskHover">
      <li id="${idWithNoSpace}_edit" contenteditable="false">${newValue}</li>
      <div class="subTaskIcons">
      <img onclick="editSubTask('${idWithNoSpace}','edit', ${index}, ${task[1]['id']}, '${value.task}')" src="./assets/img/edit.svg" alt="">
      <div class="seperator"></div>
      <img onclick="deleteSubTask('${idWithNoSpace}', ${index}, ${task[1]['id']}, '${value.task}') " src="./assets/img/delete.svg" alt="">
      </div>
</ul>
    `;
}

function returnContactCircleHTML(contact){
  return /*HTML*/ `
  <div class="d-flex alic gap1">
    <div class="circle" style="background-color: ${contact.color}">${contact.initials}</div>
    ${!editTaskOpen ? `<div>${contact.name}</div>` : ""}
  </div>
`;
}

function theNumberOfExcessAssignedContacts(assignedToEntries, contact, newClass){
  return /*HTML*/ `
        <div class="d-flex alic gap1">
          <div class="${newClass}" style="background-color: ${contact.color}">${"+" + (assignedToEntries.length - 5)}</div>
        </div>
      `;
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