const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require('path');

// const API_PORT = 3001;
const app = express();
// const router = express.Router();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const socket = require('socket.io-client')('http://localhost:3000');

app.use(cors());

// passa o request body para o formato json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger("dev"));


// inicia o backend na porta escolhida
// app.listen(API_PORT, () => console.log(`OUVINDO A PORTA ${API_PORT}`));

// MongoDB database
const dbRoute = "mongodb+srv://deborafurieri:UiwEcd7IWWtgQ5Pl@cluster0-sdesr.mongodb.net/test?retryWrites=true";

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
  );
  
// import model
require('./models/Data');

// import function
const functions = require('./functions');

//importa router e da append /api para http requests
const router = require("./routes")
app.use("/api", router);

// atribuindo conexao mongoose a variável
let db = mongoose.connection;

// checa se a conexão com a database foi realizada com sucesso
db.once("open", () => console.log("conectado a database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Config serial port
var SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
const serial = new SerialPort(
  "/dev/cu.SLAB_USBtoUART4",
  { baudRate: 115200 },
);
  
const parser = serial.pipe(new Readline({ delimiter: '\n' }));

serial.on('open', () => {
  console.log("Opened");
});

serial.on('error', function( msg ) {
  console.log("First Serial port error: " + msg );
});

socket.on('action', (msg) => {
  serial.write(JSON.stringify(msg));
});

parser.on('data', (data) => {
  try {
    var allData = JSON.parse(data);
    // console.log('data', allData);
    functions.response(allData, socket.emit('data', allData));
  } catch(e) {
    console.log('erro', e);
  }
});

socket.on('disconnect', function() {
  console.log('disconnect');
})

server.listen(3001, function(){
  console.log('ouvindo na porta 3001');
})
