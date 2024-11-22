let toDo, inProgress, awaitFeedback, done;
let toDoPos, inProgressPos, awaitFeedbackPos, donePos;


const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      const toDo = document.querySelector(".toDoArea");
      const inProgress = document.querySelector(".progressArea");
      const awaitFeedback = document.querySelector(".feedbackArea");
      const done = document.querySelector(".doneArea");

      if (toDo && inProgress && awaitFeedback && done) {
        console.log("Alle Elemente sind verfügbar");
        toDoPos = toDo.getBoundingClientRect();
        inProgressPos = inProgress.getBoundingClientRect();
        awaitFeedbackPos = awaitFeedback.getBoundingClientRect();
        donePos = done.getBoundingClientRect();

        console.log("toDoPos:", toDoPos);
        console.log("donePos:", donePos);

        observer.disconnect();
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });


function addStart(elem) {
  console.log("Wird getriggert");
  console.log("Füge touchmove Listener hinzu:", elem.target);
  elem.target.addEventListener("touchstart", (e) => {
    let startX = elem.changedTouches[0].clientX;
    let startY = elem.changedTouches[0].clientY;

    elem.target.addEventListener("touchend", (eve) => {
      elem.target.style.zIndex = 0;
      console.log("wir kommen auch hier rein");
      console.log("Top Position",elem.target.getBoundingClientRect().top,"DonePos Top", donePos.top);
      
      if (elem.target.getBoundingClientRect().top > donePos.top) {
        console.log("Wir sind einen schritt weiter");
        
        if (!done.contains(elem)) {
          done.appendChild(elem);
        }
      } else if (elem.target.getBoundingClientRect().bottom < toDoPos.bottom) {
        console.log("wir sind im else if");
        
        if (!toDo.contains(elem)) {
          toDo.appendChild(elem);
        }
      }

      elem.target.style.left = 0 + "px";
      elem.target.style.top = 0 + "px";
      console.log("Wir sind am Ende von touchEnd");
      
    });
    elem.target.addEventListener("touchmove", (eve) => {
      console.log("Wir bewegen uns");
      
      eve.preventDefault();
      let nextX = eve.changedTouches[0].clientX;
      let nextY = eve.changedTouches[0].clientY;
      // console.log(nextX,nextY);
      
      elem.target.style.left = nextX - startX + "px";
      elem.target.style.top = nextY - startY + "px";
      // console.log(elem.target.style.top, elem.target.style.left);
      // console.log("Move Top Position",elem.target.getBoundingClientRect().top);
      
      
      elem.target.style.zIndex = 10;
    });
  });
}
