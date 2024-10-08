function htmlTechnicalTaskSmall(element, index) {
  return /*HTML*/`
      <div draggable="true" ondragstart="startDraggin(${element[1]['id']})" class="d-flex dflex-col smallTask">
      <div class="d-flex alic jc-c userStoryBackground br1 userStory"><span>User Story</span></div>
      <h1>${element[1]['headline']}</h1>
      <span>${element[1]['description']}</span>
      <div class="d-flex jc-sb alic">
        <div class="d-flex colorGreyBg progress alic" style="width: 100%;">
          <div class="d-flex colorBlueBg progress alic" style="width: 50%;"></div>
        </div>
        <span class="subTaskFont" style="width:100%">1/2 Subtasks</span>
      </div>
      <div class="d-flex jc-sb">
        <div id="assignedTo${index}" class="d-flex pl035">

        </div>
        <img src="./assets/img/prioMedia.svg" alt="" />
      </div>
    </div>
    `;
}
