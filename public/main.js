const socket = io.connect(location.origin);//("http://localhost:8000/")
const inputEl = document.querySelector('.message');

const colorR = Math.floor(Math.random() * 256);
const colorG = Math.floor(Math.random() * 256);
const colorB = Math.floor(Math.random() * 256);

//DISPLAY MSG SYNC
socket.on("new-message", (data) => console.log(data));//displaying broardcasted message
function sendMessage(e) {
  socket.emit("chat-message", inputEl.value);
  inputEl.value = "";
}


function setup() {
  createCanvas(600, 600);
  background(0);
}
function draw() { }



//DRAW SYNC
socket.on("new-cords", (dataObj) => {
  noStroke();
  fill(...dataObj.colors);
  ellipse(dataObj.x, dataObj.y, 10, 10);//receives broadcasted cords(x,y) and draws
});

function mouseDragged() {
  noStroke();
  fill(colorR, colorG, colorB);
  ellipse(mouseX, mouseY, 10, 10);

  let dataObj = { x: mouseX, y: mouseY, colors: [colorR, colorG, colorB] };
  socket.emit("mouse-cords", dataObj);//pass cordinates to broadcast

  //store all drawings in SERVER
  socket.emit('store', dataObj);
}

socket.on("history", (data) => {
  data.map((elem) => {
    noStroke();
    fill(...elem.colors);
    ellipse(elem.x, elem.y, 10, 10);
    return;
  })
})



//CLEAR CANVAS SYNC
socket.on("new-clear", (data) => {
  clear();
  background(0);
})

function clearCanvas() {
  clear();
  background(0);
  socket.emit("clear", null);
}