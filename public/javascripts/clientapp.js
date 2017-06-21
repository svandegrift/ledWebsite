var socket = io.connect();
socket.on('server',function(){
    console.log("conected");
});
function sendPulse(color){
    socket.emit("sendPulse", color);
}
socket.on("button", function(){
    console.log("button was pushed");
    h = document.createElement("h1");
    boomText = document.createTextNode("BOOM");
    element = document.getElementById("boom");
    h.appendChild(boomText);
    element.appendChild(h);
    setTimeout(deleteH1,500);

});
function deleteH1(){
    while (element.firstChild){
        element.removeChild(element.firstChild);
    }
}