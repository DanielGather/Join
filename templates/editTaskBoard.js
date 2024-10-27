async function editTaskBoard(task, date) {
  return /*HTML*/ `
    <div class="main-addTask-container">
  <form class="form-container" onsubmit="return handleSubmit(event)">
    <div class="addTask-content-form-container">
      <div class="title-description-assigned-container">
        <div class="title-description-assigned">
          <label class="addTask-label"><span class="star">*</span></label>
          <input required class="title-input" value="${task.headline}" placeholder="Enter a title"/>
        </div>

        <div class="title-description-assigned">
          <label class="addTask-label">Description</label>
          <textarea rows="4" placeholder="Enter a Description">${task.description}</textarea>
        </div>
        <div class="dueDate-container">
          <label class="addTask-label">Due date<span class="star">*</span></label>
          <input required class="title-input" value="${date}" type="date" />
        </div>
        <div class="prio-container">
          <label class="addTask-label">Prio</label>
          <div class="prio-buttons">
            <button id="urgent" class="urgent-medium-low-buttons">Urgent ${urgentSvg}</button>
            <button id="medium" class="urgent-medium-low-buttons">Medium ${mediumSvg}</button>
            <button id="low" class="urgent-medium-low-buttons">Low ${lowSvg}</button>
          </div>
        </div>
        <div class="title-description-assigned">
          <label class="addTask-label">Assigned to</label>
          <div>
            <div class="inputAssignedToContainer">
              <input type="text" placeholder="Select contacts to assign" />
              <img src="./assets/img/arrow_drop_down.svg" alt="arrow_drop_down" id="imgDropdownToggle" onclick="toggleAssignedToDropDown()" />
            </div>
            <div class="d-flex gap1 pt1" id="assignedTo${task["id"]}_editTask"></div>
            <div class="dropDownContainer d-none" id="dropDownMenu">
              <div class="dropDownContacts">
                <div class="initialNameContainer">
                  <div class="initialsAssigned">CR</div>
                  <p>Christiano Ronaldo</p>
                </div>
                <input type="checkbox" />
              </div>

              <div class="dropDownContacts">
                <div class="initialNameContainer">
                  <div class="initialsAssigned">LM</div>
                  <p>Lionel Messi</p>
                </div>
                <input type="checkbox" />
              </div>

              <div class="dropDownContacts">
                <div class="initialNameContainer">
                  <div class="initialsAssigned">HK</div>
                  <p>Harry Kane</p>
                </div>
                <input type="checkbox" />
              </div>

              <div class="dropDownContacts">
                <div class="initialNameContainer">
                  <div class="initialsAssigned">JB</div>
                  <p>Jude Bellingham</p>
                </div>
                <input type="checkbox" />
              </div>
            </div>
          </div>
        </div>
        
        
        <div class="category-container">
          <label class="addTask-label">Category <span class="star">*</span></label>
          <div class="category-header-container">
            <div id="category-header">Select task category</div>
            <img src="./assets/img/arrow_drop_down.svg" alt="arrow_drop_down" id="imgCategoryDropdownToggle" onclick="toggleCategoryDropDown()" />
          </div>
          <div class="category-dropdown-container d-none" id="categoryDropdownMenu">
            <div class="choose-category-container" onclick="setCategory('Technical Task')">Technical Task</div>
            <div class="choose-category-container" onclick="setCategory('User Story')">User Story</div>
          </div>
        </div>
        <div class="subtasks-container">
                                <label class="addTask-label">Subtasks</label>
                                <div class="subtasks-input-add-container">
                                    <input class="subtasks-input" id="subtasks-input" type="text" placeholder="Add new subtask" autocomplete="off">
                                    <div class="add-subtask"><img src="./assets/img/add_dark.svg" alt="Plus-Icon" id="plusIcon" onclick="toggleSubtaskIcons()" ></div> 
                                    <div class="close-separator-checked-container d-none" id="actionIcons">
                                        <div class="subtask-close-icon"><img src="./assets/img/close.svg" alt="Close-Icon" onclick="deleteInputSubtaskValue()"></div>
                                        <div class="subtask-separator"></div>
                                        <div class="subtask-checked-icon"><img src="./assets/img/checked_subtask.svg" alt="Checked-Icon" onclick="addSubTask()"></div>
                                    </div>
                                </div>
                            </div>
      </div>
      <div class="rendered-task-container opacity-0" id="subTask${task.id}_editTask"></div>

      </div>
    </div>

    <div class="form-confirmation">
      <div class="required"><span class="star">*</span>This field is required</div>
      <div class="clear-create-button">
        <button class="create-task-button" type="submit" id="createTask">Ok<img src="./assets/img/checked.svg" /></button>
      </div>
    </div>
  </form>
</div>

    
    `;
}
