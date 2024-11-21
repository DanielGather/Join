/**
 * Adds or removes a user from the `assignedTo` list of a task in Firebase,
 * based on the state of a checkbox.
 * This function retrieves the task ID and variables needed to update the
 * `assignedTo` list in Firebase. If the checkbox associated with the user is
 * checked, it adds the user's email to the `assignedTo` list. If unchecked, it
 * removes the user from the list using `removeAssignedToFromFireBase`.
 * @param {string} email - The email address of the user to be added or removed.
 */
async function addAssignedToToFireBase(email) {
    objectArray = {};
    let getTaskId = await getIdFromDb("/toDos", "id", currentTaskId);
    let myVariablesObject = await returnMyVariables(email, getTaskId);
    let checkBoxContainer = document.getElementById(email);
    if (myVariablesObject.toDo !== null) {
      let toDoEntries = Object.entries(myVariablesObject.toDo);
      toDoEntries.forEach(([key, value]) => {
        objectArray[key] = value;
      });
    }
    if (checkBoxContainer.checked) {
      objectArray["userEmail" + myVariablesObject.number] = myVariablesObject.email;
      putData(myVariablesObject.path, objectArray);
    } else {
      removeAssignedToFromFireBase(myVariablesObject.email, getTaskId);
    }
  }

/**
 * Removes a user from the `assignedTo` list of a task in Firebase.
 * This function retrieves the `assignedTo` entries of a task from Firebase and
 * checks if the specified email address is present in the entries. If a matching
 * entry is found, it deletes the corresponding entry in Firebase using its key.
 * @param {string} email - The email address of the user to be removed.
 * @param {string} getTaskId - The ID of the task from which the user will be removed.
 **/
async function removeAssignedToFromFireBase(email, getTaskId) {
    let toDo = await getData("/toDos/" + getTaskId + "/assignedTo");
    let toDoEntries = Object.entries(toDo);
    toDoEntries.forEach(([key, value]) => {
      if (value == email) {
        path = `/toDos/${getTaskId}/assignedTo/${key}`;
      } else {
        return;
      }
    });
    deleteData(path);
  }