function returnAddTaskHtml(type) {
  return /*HTML*/ ` 
            <div class="main-addTask-container">
                <h1>Add Task</h1>

                <form class="form-container" onsubmit="return handleSubmit(event, this.dataset.type)" data-type="${type}">
                    <div class="addTaskBoard-content-form-container">
                        <div class="title-description-assigned-container">
                            <div class="title-description-assigned">
                                <label class="addTask-label">Title<span class="star">*</span></label>
                                <input required class="title-input" id="addTaskTitle" placeholder="Enter a title" autocomplete="off">
                            </div>

                            <div class="title-description-assigned">
                                <label class="addTask-label">Description</label>
                                <textarea rows="4" placeholder="Enter a Description" id="textForDescription"></textarea>
                            </div>

                            <div class="title-description-assigned">
                                <label class="addTask-label">Assigned to</label>
                                <div style="position:relative">
                                    <div class="inputAssignedToContainer">
                                        <input type="text" id="searchContact" onkeyup="searchExistingContact()" placeholder="Select contacts to assign">
                                        <div class="arrow-drop-down-img"><img src="./assets/img/arrow_drop_down.svg" alt="arrow_drop_down" id="imgDropdownToggle" onclick="toggleAssignedToDropDown()"></div>
                                    </div>
                                    <div class="dropDownContainer d-none" id="dropDownMenu">
                                        <!-- <div class="dropDownContacts" id="dropDownContacts">
                                            <div class="initialNameContainer" id="initialNameContainer">
                                                <div class="initialsAssigned" id="initialsAssigned">CR</div>
                                                <p id="contactNameAddTask">Christiano Ronaldo</p>
                                            </div>
                                            <input type="checkbox" id="contactCheckbox" onclick="renderInitials()">
                                        </div> -->
                                        
                                    </div>
                                    <div class="renderedInitialsContainer" id="renderedInitialsContainer"></div>
                                </div>
                            </div>
                        </div>

                        <div class="addTask-seperator"></div>

                        <div class="dueDate-prio-category-subtasks-container">
                            <div class="dueDate-container">
                                <label class="addTask-label">Due date<span class="star">*</span></label>
                                <input required class="title-input" type="date" id="inputDate">
                            </div>

                            <div class="prio-container">
                                <label class="addTask-label">Prio</label>
                                <div class="prio-buttons">
                                    <button type="button" class="urgentButton" id="urgentButtonAddTask" onclick="chooseTaskPrioType('urgent','AddTask')">Urgent <img id="urgentButtonImgAddTask"
                                            src="./assets/img/prio_urgent.svg"></button>
                                    <button type="button" class="mediumButton" id="mediumButtonAddTask" onclick="chooseTaskPrioType('medium','AddTask')">Medium <img id="mediumButtonImgAddTask"
                                            src="./assets/img/prio_medium.svg"></button>
                                    <button type="button" class="lowButton" id="lowButtonAddTask" onclick="chooseTaskPrioType('low','AddTask')">Low <img id="lowButtonImgAddTask"
                                            src="./assets/img/prio_low.svg"></button>
                                </div>
                            </div>

                            <div class="category-container">
                                <label class="addTask-label">Category <span class="star">*</span></label>
                                <div class="category-header-container">
                                    <div id="category-header">Select task category</div>
                                    <div class="arrow-drop-down-img"><img  src="./assets/img/arrow_drop_down.svg" alt="arrow_drop_down" id="imgCategoryDropdownToggle" onclick="toggleCategoryDropDown()"></div>
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
                            <div class="rendered-task-container opacity-0" id="rendered-task-container"></div>
                        </div>
                    </div>

                    <div class="form-confirmation">
                        <div class="required"><span class="star">*</span>This field is required</div>
                        <div class="clear-create-button">
                            <button class="clear-button" type="submit" id="clear">Clear <img
                                    src="./assets/img/vector.svg"></button>
                            <button class="create-task-button" type="submit" disabled id="createTask">Create Task <img
                                    src="./assets/img/checked.svg"></button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="popup-addTask-container" id="popup-addTask-container">
                <p>Task added to board</p>
                <img src="./assets/img/board-icon.svg" alt="board-icon">
            </div>
        </main>
    </div>
    `;
}
