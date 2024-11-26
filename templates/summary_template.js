
function returnSummaryHTML(){
 return /*HTML*/`
<div class="summary-main-content-box">
          <div class="content-header-grid-container">
            <h1>Join 360</h1>
            <div class="header-text">Key Metrics at a Glance</div>
            <div class="header-seperator-box"></div>
          </div>

          <div class="summary-content-greeting-container">
            <div class="content-summary-box">
              <div class="To-Do-Done-box">
                <div class="to-do-box">
                  <div>
                    <svg class="icon-summary" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="34.5" cy="35" r="34.5" fill="#2A3647" />
                      <mask id="mask0_231971_1449" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="18" y="19" width="33" height="32">
                        <rect x="18.5" y="19" width="32" height="32" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_231971_1449)">
                        <path d="M25.1667 44.3332H27.0333L38.5333 32.8332L36.6667 30.9665L25.1667 42.4665V44.3332ZM44.2333 30.8998L38.5667 25.2998L40.4333 23.4332C40.9444 22.9221 41.5722 22.6665 42.3167 22.6665C43.0611 22.6665 43.6889 22.9221 44.2 23.4332L46.0667 25.2998C46.5778 25.8109 46.8444 26.4276 46.8667 27.1498C46.8889 27.8721 46.6444 28.4887 46.1333 28.9998L44.2333 30.8998ZM42.3 32.8665L28.1667 46.9998H22.5V41.3332L36.6333 27.1998L42.3 32.8665Z" fill="white" />
                      </g>
                    </svg>
                  </div>
                  <div class="num-text">
                    <div id="summaryToDo" class="font-type2"></div>
                    <div>To-do</div>
                  </div>
                </div>
                <div class="done-box">
                  <div>
                    <svg class="icon-summary" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="35" cy="35" r="34.5" fill="#2A3647" />
                      <path d="M20.0283 35.0001L31.2571 46.0662L49.9717 23.9341" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="num-text">
                    <div id="doneToDo" class="font-type2"></div>
                    <div>Done</div>
                  </div>
                </div>
              </div>

              <div class="urgent-deadline-box">
                <div class="urgent-box">
                  <div><img class="icon-summary" src="./assets/img/urgent.svg" /></div>
                  <div class="num-text">
                    <div id="urgentPriority" class="font-type2"></div>
                    <div>Urgent</div>
                  </div>
                </div>

                <div class="content-seperator-box"></div>
                <div class="date-deadline-box">
                  <div id="upcomingDeadline" class="summary-date"></div>
                  <div>Upcoming Deadline</div>
                </div>
              </div>

              <div class="board-progress-feedback-box">
                <div class="single-box-board-progress-feedback">
                  <div id="lengthTasks" class="font-type2"></div>
                  <div>Tasks in <br />Board</div>
                </div>
                <div class="single-box-board-progress-feedback">
                  <div id="progressToDo" class="font-type2"></div>
                  <div>
                    Tasks in <br />
                    Progress
                  </div>
                </div>
                <div class="single-box-board-progress-feedback">
                  <div id="awaitFeedbackToDo" class="font-type2"></div>
                  <div>Awaiting <br />Feedback</div>
                </div>
              </div>
            </div>

            <div id="greetContainer" class="greeting-container d-none">
              <p id="dayTime" class="greeting-daytime"></p>
              <p id="currentUserLogin" class="greeting-name"></p>
            </div>

            <div class="greeting-guest-container d-none">
              <p class="greeting-daytime">Good morning</p>
            </div>
          </div>
        </div>
 `
}
