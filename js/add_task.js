function handleSubmit(event) {   // prüfen welcher button geklickt wurde
    event.preventDefault();
    const submitButton = event.submitter;    
    if (submitButton.id === "clear") {
        clear(); 
    } else if (submitButton.id === "createTask") {
        createTask(); 
    }   
    return false;
}


function clear() {
    console.log("clear test test"); 
}


function createTask() {
    console.log("createTask test test");
}