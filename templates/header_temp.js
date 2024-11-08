function returnHeaderHtml(initials){
  return /*HTML*/`
      <div class="header">
      <div class="joinLogo">
        <img src="../assets/img/joinLogo.svg" alt="" />
      </div>
      <div class="headline">
        <span>Kanban Project Management Tool</span>
      </div>
      <div id="headerButtonsContainer" class="userIcons">
      <div class="posAbs">
            <div id="popUp" class="posRelative popUp d-flex dflex-col d-none">
              <a class="help header-link" href="./help.html">Help</a>
              <br class="brHelp">
              <a class="p050 header-link" href="./legalNotice.html">Legal Notice</a>
              <br>
              <a class="p050 header-link" href="./privacyPolicy.html">Privacy Policy</a>
              <br>
              <a onclick="logOut(); return true;" class="p050 header-link" href="./index.html">Log out</a>            </div>
          </div>
        <div id="helpButton" class="help-button">
          <a href="./help.html"><img src="./assets/img/helpButton.svg" alt="help"></a>
        </div>
        <div onclick="showPopUp()" class="circle">
          <span>${initials}</span>
        </div>
      </div>
    </div>`
}