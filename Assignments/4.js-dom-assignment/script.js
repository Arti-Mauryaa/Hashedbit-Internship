// Dark Theme
document.getElementById("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Div Creation
function createDiv(width, height, text) {
    const div = document.createElement("div");

    div.style.width = width + "px";
    div.style.height = height + "px";
    div.textContent = text;

    document.getElementById("container").appendChild(div);
}

document.getElementById("createBtn").addEventListener("click", () => {
    createDiv(200, 100, "New Div Created");
});

// Hide Show Paragraph
document.getElementById("togglePara").addEventListener("click", () => {
    const para = document.getElementById("para");

    if (para.style.display === "none") {
        para.style.display = "block";
    } else {
        para.style.display = "none";
    }
});

// Dynamic CSS
document.getElementById("styleBtn").addEventListener("click", () => {
    const box = document.getElementById("box");

    box.style.backgroundColor = "blue";
    box.style.color = "white";
    box.style.padding = "20px";
    box.style.borderRadius = "10px";
});