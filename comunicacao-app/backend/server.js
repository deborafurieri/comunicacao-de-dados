// const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require('path');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);


app.use(cors());

app.use((req, res, next) => {
  res.io = io;
  next();
});

// passa o request body para o formato json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger("dev"));

//importa router e da append /api para http requests
const router = require("./routes")
app.use("/api", router);

// Config serial port
var SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
const serial = new SerialPort(
  "/dev/cu.SLAB_USBtoUART",
  { baudRate: 115200 },
);
  
const parser = serial.pipe(new Readline({ delimiter: '\n' }));

serial.on('open', () => {
  console.log("Opened");
});

serial.on('error', function( msg ) {
  console.log("First Serial port error: " + msg );
});

parser.on('data', (data) => {
  console.log(data)
  io.emit("test", data);
});

io.on("connection", (function (socket) {
  console.log('user connected');
  // recebe client data
  socket.on('client_data', function(setPoint){
    process.stdout.write(setPoint);
    serial.write(setPoint);
    // console.log(setPoint)
  });
}));

io.on('disconnect', function() {
  console.log('disconnect');
})

server.listen(3001, function(){
  console.log('ouvindo na porta 3001');
})
