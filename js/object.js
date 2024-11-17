async function returnMyVariables(email, getTaskId) {
    const myVariables = {
      path: "/toDos/" + getTaskId + "/assignedTo/",
      email: email,
      number: setCounter(),
      toDo: await getData("/toDos/" + getTaskId + "/assignedTo"),
    };
    return myVariables;
  }