//-----------------------------------------------------------------------------------
//--------------------------------------> REQUIRE <----------------------------------
//-----------------------------------------------------------------------------------
var express = require('express');
var app = express();

const fetch = require("node-fetch");
var path = require('path');
const assert = require('assert');

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
const jsonParser = bodyParser.json();

var fs = require('fs');

//Create HTTP server
const http = require('http').createServer(app);

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log('listening');
});

//--------------------------------------> MY APP <----------------------------------
app.use(express.static(__dirname + '/figuresapp'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/figuresapp/index.html'));
});

const io = require('socket.io')(http);

//-----------------------------------------------------------------------------------
//-----------------------------> CONNECTION TO MONGO DB <----------------------------
//-----------------------------------------------------------------------------------
const MongoClient = require('mongodb').MongoClient;
//const MONGO_URL = "mongodb://localhost:27017/?readPreference=primary&ssl=false";
//const client = new MongoClient(MONGO_URL);

const DATABASE_NAME = 'drawingsave';
const url = "mongodb+srv://figureappstore.yw4o2.mongodb.net/drawingsave";
//"mongodb+srv://KATELL:fQirIuESo28fkpcm@cluster0.8y1jo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//var url = process.env.MONGOLAB_URI;

//`mongodb://localhost:49153/${DATABASE_NAME}`; // a voir selon port !!!

let db  = null;
let collection = null;

MongoClient.connect(url, function(err, client){
  console.log("Connected to db successfully");
  db = client.db(DATABASE_NAME);
  collection = db.collection('app');  
})

//-----------------------------------------------------------------------------------
//-----------------------------> SAVE on SERVER + FOLDER <---------------------------
//-----------------------------------------------------------------------------------
app.post('/save', (req, res, next) => {

  //Save it on the dedicated folder saveiamges
  var data = req.body.url.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  //req.body.date will be the name of our file as it is unique
  fs.writeFile('./saveimages/'+req.body.date+'.png', buf, function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });

  //Save in db
  message = insertDrawing(req.body.url,req.body.user,req.body.date);
  return message ;

});

//Mongo querry to save images on db
async function insertDrawing(fig,user,date){
  try {
    const doc = {image: fig, user:user, date:date};

    if(doc.user != ''){
      const result = await collection.insertOne(doc);
      console.log(`Document id: ${result.insertedId}`);
    }
    else{
      console.log('No user in here !');
    }
  }
  catch(error){
    console.log("Error", error);
    }
}

//-----------------------------------------------------------------------------------
//---------------------------> CALL ALL SAVED IMAGE of the DB <----------------------
//-----------------------------------------------------------------------------------
app.post("/savedimages",jsonParser, async function (req, res) {
  userfigures = await queryDrawing();
  res.send({data:userfigures});
})

//Mongo querry to get all saved images
async function queryDrawing(){
  const result = [];
  const userfigures = await collection.find().toArray();
  for(const line of userfigures){
    result.push( {image:line.image, user:line.user, date:line.date});
  }
  return result;
}



//--------------------------------------> TO Draw in live <----------------------------------
//HTTP Connection :
//IO 
io.on('connection', (socket) => {
  console.log('A user is connected');

  //FIGURES
  socket.on('figureSend', (fig, username) => {
    //console.log('The Shape drew: ' + fig.form);
    //console.log('from',  username);
    io.emit('figureReceive',fig, username);

  });

  //DRAWING
  //Start
  socket.on('startDraw', (x1, y1, color, px) => {
    io.emit('StartReceive',x1, y1, color, px);
  });
  //Draw
  socket.on('Drawing', (x, y, X, Y, color, px) => {
    io.emit('DrawingReceive',x, y, X, Y, color, px);
  });
  //Stop
  socket.on('stopDraw', (x, y, X, Y) => {
    io.emit('StopReceive',x, y, X, Y);
  });

  //DISCONNECT
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});





