//---------------------------------> INITIALISATION <-------------------------------------

//If the user is not log: he can't use the app
//Display figure button
document.getElementById("btn1").disabled = true;
//Save buttons
document.getElementById("btn5").disabled = true;
document.getElementById("btn6").disabled = true;
document.getElementById("btn7").disabled = true;

//---> Not use here (for previous td)
//let figures=[];
//var allFigs = localStorage.getItem("figures");
//var parsedFigs = JSON.parse(allFigs);
//var wholeCanvas = [];

//Variables
const canvas = document.getElementById("myCanvas");
var username = document.getElementById('username').value.toUpperCase();

var socket = io();

//---------------------------------> DISPLAY FIGURE <-----------------------------------------
//DRAW Figure when the button display is cliked:
function startDraw(){
  var form = document.getElementById('form').value;
  var borderPx = document.getElementById('px').value;
  var figPx = document.getElementById('size').value; //A utiliser...
  var bgCol = document.getElementById('btn2').value;
  var borderCol = document.getElementById('btn3').value;

  const ctx = canvas.getContext("2d");

  if(figPx == "") //if no selected by the user
  {
    figPx=2;
  }
  else{
    figPx = parseInt(figPx);
  }
  if(borderPx == "") //no selected by the user
  {
    borderPx=2;
  }
  else{
    borderPx = parseInt(borderPx);
  }

  ctx.lineWidth = borderPx;
  ctx.fillStyle = bgCol;
  ctx.strokeStyle = borderCol;

  //Random start
  startY = getRandomInt(300);
  startX = getRandomInt(1000);
    
  //Drawing  
  drawLine();
  ctx.beginPath();
  
  if (form == "Circle")
  {
    ctx.arc(startX,  startY , 5*figPx, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  if (form == "Square")
  {
    ctx.moveTo(startX+(5*figPx), startY);
    ctx.lineTo(startX, startY+(5*figPx));
    ctx.lineTo(startX-(5*figPx), startY);
    ctx.lineTo(startX, startY-(5*figPx));
    ctx.lineTo(startX+(5*figPx), startY);
    ctx.fill();
    ctx.stroke();
  }

  if (form == "Triangle")
  {
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+(5*figPx), startY);
    ctx.lineTo(startX-(2*figPx), startY+(5*figPx));
    ctx.lineTo(startX, startY);
    ctx.stroke();
    ctx.fill();
  }
  
  //SAVING in LOCAL STORAGE - not ask for this project
  //---> Not use here (for previous td)
  //wholeCanvas.push([form, bgCol,figPx,borderPx,borderCol,startX,startY]);
  //localStorage.setItem("figures", JSON.stringify(wholeCanvas));
  
  //Call server to draw the figure in every other user page
  const data ={"form":form, "bgCol":bgCol,"figPx":figPx,"borderPx":borderPx,"borderCol":borderCol,"startX":startX,"startY":startY};
  
  socket.emit('figureSend', data, username);
}  

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//---------------------------------> LOG IN <-----------------------------------------
function login(){

  username = document.getElementById('username').value.toUpperCase();
  //Allow user to use button and display figures
  document.getElementById("btn1").disabled = false;
  document.getElementById("btn5").disabled = false;
  document.getElementById("btn6").disabled = false;
  document.getElementById("btn7").disabled = false;

  document.getElementById('user').innerHTML = "<p> Account of : "+username+"</p>";
  
  console.log("Username log in : ", username); 
}


//-----------------------------------------------------------------------------------
//----------------------------------> ASSIGNEMENT 1 <--------------------------------
//-----------------------------------------------------------------------------------
//-----------------------> OPEN IMAGE in New tab (to save it) <----------------------
//-----------------------------------------------------------------------------------

function open1(){

  //Get our current canvas image
  const dataUrl = canvas.toDataURL("png");

  let img = "<img src='"+dataUrl+"'/>";

  //To display the image below the drawing and allox to save it
  let app = document.getElementById('app');
  app.insertAdjacentHTML('beforeend',img);

  //To open the image but no allow to save it
  //window.open().document.write(img);
  //or
  //var myWindow = window.open("", "_blank");
  //myWindow.document.write(img);

  //To open the image and allow to save it but not in a new tab
  //window.open(document.write(img),'_blank');

  //To open the image in a new tab and allow to save it by using right click : 
  let imageLink= '<a href="'+ dataUrl +'" target="_blank">Save the image by right clicking on me and select "save the content linked as..." </a>'+
  "<img src='"+dataUrl+"'/>"
  window.open().document.write(imageLink);


  //other test that don't work
  //let link = "<a href="+dataUrl+"> <img src="+dataUrl+"/> </a>"
  //let link2 = "<img src="+dataUrl+" <a href="+dataUrl+"> </a> />"
  //window.open().document.write(link)
  //window.open().document.write(link2)

}


//-----------------------------------------------------------------------------------
//----------------------------------> ASSIGNEMENT 2 <--------------------------------
//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
//---------------------------> SAVE THE IMAGE ON SERVER <----------------------------
//-----------------------------------------------------------------------------------
function save(){

  const dataUrl = canvas.toDataURL("png");
  let date = Date.now();

  //usernamer, datetime, URL to image
  //Send to MongoDB
  //Use Fetch to send the image stored in the DataURL to the new endpoint.

  const mydoc = {url: dataUrl, user:username, date: date};

  const fetchOptions = {
    method : 'POST',
    headers : {
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    body : JSON.stringify(mydoc)//jsonFigure)
  };
  fetch('/save', fetchOptions); 

  //Display a sucess message on client when upload is done.
  console.log("Your image has been successfully download");
}


//-----------------------------------------------------------------------------------
//-------------------------------> ALL SAVED IMAGES <--------------------------------
//-----------------------------------------------------------------------------------

//Add a "saved images" button in the menubar that will open a new page listing 
//all saved images with links to open them.
async function allSave(){

  images = await queryDrawing();

  //Display all saved in image on a new page
  var win = window.open(); 
  win.document.body.innerHTML = "<div id='savedImages'> <h1> All saved Image: </h1> </>";
  savedImages = win.document.getElementById("savedImages");

  for (let i = 0; i < images.length ; i++) {
    let image = "<p> User: "+images[i].user+"</p>"
    + "<p> Date:"+images[i].date+"</p>"+
    "<p> Image : </p>" + "<img src='"+images[i].image+"'/> "+
  "<p> Link to open its (in new tab):" + "<a href="+images[i].image+">Link to open its (in new tab)</a> </p>"
    savedImages.insertAdjacentHTML('beforeend',image);
  }
}

//Ask the the mongo db all the saved drawings
async function queryDrawing(){

  const fetchOp = {
    method : 'POST',
    headers : {
      'Content-Type':'application/json; charset=UTF-8'
    }    
  };

  return fetch('/savedimages', fetchOp).then(function(result) {
            return result.json();})
           .then(function(json){
            return(json.data)});
}




//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------






//-------------------------------> DRAW A RESTORED SHAPE <--------------------------------
function drawShape(Fig)
{
  var form = Fig.form;
  var borderPx = Fig.borderPx
  var figPx = Fig.figPx ;
  var bgCol = Fig.bgCol;
  var borderCol = Fig.borderCol;
  startY = Fig.startY;
  startX = Fig.startX;

  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = borderPx; 
  ctx.fillStyle = bgCol;
  ctx.strokeStyle = borderCol;

  //Drawing=
  ctx.beginPath();

  if (form == "Circle")
  {
    ctx.arc(startX,  startY , 5*figPx, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  if (form == "Square")
  {
    ctx.moveTo(startX+(5*figPx), startY);
    ctx.lineTo(startX, startY+(5*figPx));
    ctx.lineTo(startX-(5*figPx), startY);
    ctx.lineTo(startX, startY-(5*figPx));
    ctx.lineTo(startX+(5*figPx), startY);
    ctx.fill();
    ctx.stroke();
  }

  if (form == "Triangle")
  {
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+(5*figPx), startY);
    ctx.lineTo(startX-(2*figPx), startY+(5*figPx));
    ctx.lineTo(startX, startY);
    ctx.stroke();
    ctx.fill();
  }

}  



//------------------>Communication between user : draw other user figure <--------------------
socket.on('figureReceive', function(fig, user){
  readShape(user, fig);
});

function readShape(username, fig){
  drawShape(fig);
  document.getElementById('lastuser').innerHTML = username;
}  



function onTextReady(json) {
  console.log(json);
}
function onResponse(response) {
  return response.json();
}








//---------------------------------------------------------------------------------------
//-----------------------> MOUSE DRAWING + Live drawing with socket <--------------------
//---------------------------------------------------------------------------------------


const canvas2 = document.getElementById('myCanvas'); //-> don't allow to draw
const c2 = canvas2.getContext('2d');
c2.strokeStyle = document.getElementById('btn4').value;
c2.lineWidth = document.getElementById('pxPen').value;
let isDrawing = false;

//ESSAIT pour pas que ca change de couleurs si on dessine en meme temps mais ne marche pas bien
const canvas3 = document.getElementById('myCanvas');
const c3 = canvas3.getContext('2d');
c3.strokeStyle = document.getElementById('btn4').value;
c3.lineWidth = document.getElementById('pxPen').value;
let isDrawingUser = false;
let x=0;
let y=0;

function drawLine(x1, y1, x2, y2) {
  // using a line between actual point and the last one solves the problem
  // if you make very fast circles, you will see polygons.
  // we could make arcs instead of lines to smooth the angles and solve the problem
  c2.beginPath();
  c2.moveTo(x1, y1);
  c2.lineTo(x2, y2);
  c2.stroke();
  c2.closePath();  
}

function drawLineUser(x1, y1, x2, y2) {
  // using a line between actual point and the last one solves the problem
  // if you make very fast circles, you will see polygons.
  // we could make arcs instead of lines to smooth the angles and solve the problem
  c3.beginPath();
  c3.moveTo(x1, y1);
  c3.lineTo(x2, y2);
  c3.stroke();
  c3.closePath();  
}


//L'évènement mousedown est déclenché à partir d'un Element lorsqu'on appuie sur le bouton 
//d'un dispositif de pointage (une souris par exemple) pendant que le curseur est sur l'élément.
//START
canvas2.addEventListener('mousedown', function(e) {
  if (document.getElementById("btn1").disabled==false){
    c2.strokeStyle = document.getElementById('btn4').value;
    c2.lineWidth = document.getElementById('pxPen').value;
    
    const rect = canvas2.getBoundingClientRect()
    x = e.clientX - rect.left
    y = e.clientY - rect.top
    isDrawing=true;

    socket.emit('startDraw',x, y, c2.strokeStyle, c2.lineWidth);
  }
    
    
})

socket.on('StartReceive', function(x1, y1,x2, y2, color, px){
  c3.strokeStyle = color;
  c3.lineWidth = px;
  const rect = canvas2.getBoundingClientRect();
  isDrawingUser=true;
});

//MOUVE
canvas2.addEventListener('mousemove', e => {

    if (isDrawing === true) {
      drawLine(x, y, e.offsetX, e.offsetY);
      socket.emit('Drawing',x, y, e.offsetX, e.offsetY,c2.strokeStyle, c2.lineWidth);
      x = e.offsetX;
      y = e.offsetY;
  }
  
});

socket.on('DrawingReceive', function(x1, y1,x2, y2, color, px){
  if (isDrawingUser === true) {
    c3.strokeStyle = color;
    c3.lineWidth = px;
    drawLineUser(x1, y1, x2, y2);
  }

});

//STOP
window.addEventListener('mouseup', e => {

  if (document.getElementById("btn1").disabled==false){
    if (isDrawing === true) {
      drawLine(x, y, e.offsetX, e.offsetY);
  
      socket.emit('stopDraw',x, y, e.offsetX, e.offsetY);
  
      x = 0;
      y = 0;
      isDrawing = false;
    }
  }
 
});

socket.on('StopReceive', function(x1, y1,x2, y2){
  if (isDrawingUser === true) {
    drawLineUser(x1, y1, x2, y2);
    isDrawingUser  = false;
  }
});




