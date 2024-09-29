function boardJS(){
    renderBoard();
    navbarTemplate();
}

function renderBoard(){
    let htmlContent = document.getElementById("main")
    let headerContent = document.getElementById("header")
    htmlContent.innerHTML = boardHtml();
    headerContent.innerHTML = returnHeaderHtml();
}