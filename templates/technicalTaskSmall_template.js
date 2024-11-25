function htmlTechnicalTaskSmall(element) {
  return /*HTML*/ `
      <div id="${element[1]["id"]}" draggable="true" ondragstart="startDraggin(${element[1]['id']}, event)" onclick="openTask(${element[1]['id']})" ontouchstart="addStart(event)" class="d-flex dflex-col small-task">
        <div style="display:flex; justify-content:space-between;"><div id="story${element[1]["id"]}" class="d-flex alic jc-c userStoryBackground br1 userStory"><span>${element[1]["story"]}</span></div>
          <div onclick="openMenu(event, ${element[1]['id']})" class="bars">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
         </div>
        </div>
      <h1 style="max-height: 2.5rem; overflow:hidden;">${element[1]["headline"]}</h1>
      <span style="max-height: 5rem; overflow: hidden;">${element[1]["description"]}</span>
      <div id="progressbarContainer${element[1]["id"]}" class="d-flex jc-sb alic">
        <div class="d-flex colorGreyBg progress alic" style="width: 100%;">
          <div id="progressbar${element[1]["id"]}" class="d-flex colorBlueBg progress alic"></div>
        </div>
        <span id="subTaskSmall${element[1]["id"]}" class="subtask-font" style="width:100%"></span>
      </div>
      <div class="d-flex jc-sb alic">
        <div id="assignedTo${element[1]["id"]}_taskSmall" class="d-flex pl035">
        </div>
        <div id="priority${element[1]["id"]}"><img  src="./assets/img/prioMedia.svg" alt="" /></div>
      </div>
      <div id="menuContainer${element[1]["id"]}" class="menu-container">
      <div onclick="moveCategoryInFirebase(event,'toDo',${element[1]['id']})" class="menu-button">ToDo</div>
      <div onclick="moveCategoryInFirebase(event,'inProgress',${element[1]['id']})" class="menu-button">inProgress</div>
      <div onclick="moveCategoryInFirebase(event,'awaitFeedback',${element[1]['id']})" class="menu-button">AwaitFeedback</div>
      <div onclick="moveCategoryInFirebase(event,'done',${element[1]['id']})" class="menu-button">Done</div>
    </div>
    </div>
    
    `;
}
