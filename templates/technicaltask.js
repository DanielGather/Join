function technicalTaskBig(task) {
  return /*HTML*/ `
<div id="bigTaskCard" onclick="eventStopPropagation(event)" class="task">
  <div class="d-flex jc-sb">
    <div id="bigStory${task[1]['id']}" class="d-flex alic technicalTaskBackground userStory br1"><span>${task[1]['story']}</span></div>
    <div><img class="hover" onclick="closeBigTask()" src="./assets/img/close.svg" alt="" /></div>
  </div>
  <div>
    <h1 class="clamp" id="title">${task[1]['headline']}</h1>
  </div>
  <div>
    <span id="description">${task[1]['description']}</span>
  </div>
  <div class="d-flex gap1">
    <span>Due date:</span>
    <span>${task[1]['date']}</span>
  </div>
  <div>
    <div class="priority">
      <span>Priority:</span>
      <div class="status">
        <span>${task[1]['priority']}</span>
        <div id="bigPriority${task[1]['id']}" class="d-flex"><img src="./assets/img/urgentTechnicalTask.svg" alt="" /></div>
      </div>
    </div>
  </div>
  <div>
    <span>Assigned To:</span>
  </div>
  <div class="d-flex dflex-col gap1">
    <div id="bigAssignedTo${task[1]['id']}" class="d-flex gap1 dflex-col">
    </div>
  </div>
  <div>
    <span>Subtasks</span>
  </div>
  <div class="flex-grow">
    <div id="subTask${task[1]['id']}_bigTask" class="d-flex subTask">
      
    </div>
  </div>
  <div class="d-flex jc-fe pt1">
    <div class="d-flex alic gap1">
      <img class="hover" src="./assets/img/delete.svg" alt="" />
      <span class="hover">Delete</span>
      <span class="stroke"></span>
      <img onclick="editTask(${task[1]['id']})" class="hover" src="./assets/img/edit.svg" alt="" />
      <span onclick="editTask(${task[1]['id']})" class="hover">Edit</span>
    </div>
  </div>
</div>
`;
}