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