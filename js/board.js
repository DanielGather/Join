function init(){
    renderBoard();
}

function renderBoard(){
    let html = document.getElementById("content")
    html.innerHTML = boardHtml();
}