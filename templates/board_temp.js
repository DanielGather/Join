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
        <h1>Board</h1>
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
            <span>To Do</span>
            <img class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div class="d-flex jc-c">
            <div class="noTask d-flex alic jc-c colorGrey fs16">No tasks To do</div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic">
            <span>In progress</span>
            <img class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div class="d-flex jc-c">
            <div class="noTask d-flex alic jc-c colorGrey fs16">No tasks in progress</div>
          </div>
        </div>
        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic">
            <span>Await feedback</span>
            <img class="responsiveButton" src="./assets/img/plusWhite.svg" alt="" />
          </div>
          <div class="d-flex jc-c">
            <div class="noTask d-flex alic jc-c colorGrey fs16"></div>
          </div>
        </div>

        <div class="d-flex dflex-col gap1" style="width: 100%;">
          <div class="d-flex jc-sb alic" style="height: 30px;">
            <span>Done</span>
          </div>
          <div class="d-flex jc-c">
            <div class="noTask d-flex alic jc-c colorGrey"></div>
          </div>
        </div>
      </div>
    </div>
    `;
}
