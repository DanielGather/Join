function init(){
    renderBoard();
}

function renderBoard(){
    let htmlContent = document.getElementById("main")
    let headerContent = document.getElementById("header")
    htmlContent.innerHTML = boardHtml();
    headerContent.innerHTML = returnHeaderHtml();
}