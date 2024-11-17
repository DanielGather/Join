function htmlChangeToList(id, newValue, taskId, valueTask, index){
    return /*HTML*/ `
    <li id="${id}_edit" contenteditable="false">${newValue}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask('${id}','edit', ${index})" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask('${id}', ${index}, ${taskId}, '${newValue}')" src="./assets/img/delete.svg" alt="">
        </div>
  `;
}

function returnEditableSubTaskHTML(idWithNoSpace, task, value, index){
  return /*HTML*/ `
      <ul id="${idWithNoSpace}_${index}" class="subTaskList subTaskHover">
        <li id="${idWithNoSpace}_edit" contenteditable="false">${value.task}</li>
        <div class="subTaskIcons">
        <img onclick="editSubTask('${idWithNoSpace}','edit', ${index}, ${task[1]["id"]}, '${value.task}')" src="./assets/img/edit.svg" alt="">
        <div class="seperator"></div>
        <img onclick="deleteSubTask('${idWithNoSpace}', ${index}, ${task[1]["id"]}, '${value.task}') " src="./assets/img/delete.svg" alt="">
        </div>
  </ul>
      `;
}