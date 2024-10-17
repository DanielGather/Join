function technicalTaskBig() {
  return /*HTML*/ `
<div onclick="eventStopPropagation(event)" class="task">
  <div class="d-flex jc-sb">
    <div class="d-flex alic technicalTaskBackground userStory br1"><span>Technical Task</span></div>
    <div><img class="hover" onclick="closeBigTask()" src="./assets/img/close.svg" alt="" /></div>
  </div>
  <div>
    <h1 style="font-size: 61px;" id="title">CSS Architecture Planning</h1>
  </div>
  <div>
    <span id="description">Define CSS naming conventions and structure</span>
  </div>
  <div class="d-flex gap1">
    <span>Due date:</span>
    <span>02/09/2023</span>
  </div>
  <div>
    <div class="priority">
      <span>Priority:</span>
      <div class="status">
        <span>Urgent</span>
        <img src="./assets/img/urgentTechnicalTask.svg" alt="" />
      </div>
    </div>
  </div>
  <div>
    <span>Assigned To:</span>
  </div>
  <div class="d-flex dflex-col gap1">
    <div class="d-flex alic gap1">
      <div class="circle">SM</div>
      <div>Benedikt Ziegler</div>
    </div>
    <div class="d-flex alic gap1">
      <div class="circle">BZ</div>
      <div>Sofia Müller (You)</div>
    </div>
  </div>
  <div>
    <span>Subtasks</span>
  </div>
  <div>
    <div class="d-flex gap1">
      <div><input type="checkbox" /></div>
      <span>Establish CSS Methodolgy</span>
    </div>
    <div class="d-flex gap1">
      <div><input type="checkbox" /></div>
      <span>Setup Base Styles</span>
    </div>
  </div>
  <div class="d-flex jc-fe pt1">
    <div class="d-flex alic gap1">
      <img class="hover" src="./assets/img/delete.svg" alt="" />
      <span class="hover">Delete</span>
      <span class="stroke"></span>
      <img class="hover" src="./assets/img/edit.svg" alt="" />
      <span class="hover">Edit</span>
    </div>
  </div>
</div>
`;
}
