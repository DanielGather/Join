function returnHeaderHtml(){
  return /*HTML*/`
      <div class="header">
      <div class="joinLogo">
        <img src="../assets/img/joinLogo.svg" alt="" />
      </div>
      <div class="headline">
        <span>Kanban Project Management Tool</span>
      </div>
      <div class="userIcons">
      <div class="posAbs">
            <div id="popUp" class="posRelative popUp d-flex dflex-col d-none">
              <a class="help" href="./help.html">Help</a>
              <br class="brHelp">
              <a class="p050" href="./legalNotice.html">Legal Notice</a>
              <br>
              <a class="p050" href="./privacyPolicy.html">Privacy Policy</a>
              <br>
              <a class="p050" href="./index.html">Log out</a>
            </div>
          </div>
        <div class="smallCircle">
          <span href="./help.html">?</span>
        </div>
        <div onclick="showPopUp()" class="circle">
          <span>DG</span>
        </div>
      </div>
    </div>`
}