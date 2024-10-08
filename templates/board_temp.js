function boardHtml() {
  return /*HTML*/ `
    <div class="d-flex dflex-col board gap1">
      <div class="boardMobile">
      <div class="d-flex jc-sb">
        <h1>Board</h1>
        <img class="responsiveButton" src="./assets/img/plus.svg" alt="" />
      </div>
      <div class="input-container">
        <input type="text" placeholder="Dein Text" />
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
            <input type="text" placeholder="Dein Text" />
            <div class="icon-container">
              <div class="divider"></div>
              <img class="icon" src="./assets/img/search.svg" alt="" />
            </div>
          </div>
          <button class="createTaskButton alic button-dark fs16">Add task<img src="./assets/img/add.svg"></button>
        </div>
      </div>
      <div class="taskArea d-flex gap1">
        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic">
            <span style="font-family:Inter; font-weight:700; color: #42526E">To Do</span>
            <img class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div ondrop="moveToCategory('toDo')" ondragleave="removeHighlight('toDo')" ondragover="allowDrop(event); highlight('toDo')" id="toDo" class="toDoArea">
            <div  class="noTask d-flex alic jc-c colorGrey fs16">No tasks To do</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic">
            <span style="font-family:Inter; font-weight:700; color: #42526E">In progress</span>
            <img class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div ondrop="moveToCategory('inProgress')" ondragleave="removeHighlight('inProgress')" ondragover="allowDrop(event); highlight('inProgress')" id="inProgress" class="progressArea">
            <div class="noTask d-flex alic jc-c colorGrey fs16">No tasks in progress</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic">
            <span style="font-family:Inter; font-weight:700; color: #42526E">Await feedback</span>
            <img class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div ondrop="moveToCategory('awaitFeedback')" ondragleave="removeHighlight('awaitFeedback')" ondragover="allowDrop(event); highlight('awaitFeedback')" id="awaitFeedback" class="feedbackArea">
            <div class="noTask d-flex alic jc-c colorGrey fs16">No feedback</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic" style="height: 30px;">
            <span style="font-family:Inter; font-weight:700; color: #42526E">Done</span>
          </div>
          <div ondrop="moveToCategory('done')" ondragleave="removeHighlight('done')" ondragover="allowDrop(event); highlight('done')" id="done" class="d-flex dflex-col gap1" style="width: 100%;" class="doneArea">
            <div class="noTask d-flex alic jc-c colorGrey fs16">Nothing is done</div>
          </div>
        </div>
      </div>
    </div>
    `;
}
