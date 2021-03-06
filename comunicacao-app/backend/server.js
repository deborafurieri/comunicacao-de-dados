const express = require("express");
const app = express();

const server = require('http').Server(app);

server.listen(3001, function(){
  console.log('ouvindo na porta 3001');
})

const io = require('socket.io')(server);

app.use((req, res, next) => {
  res.io = io;
  next();
});

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

// readline converte os dados binários em linhas de texto
// a quebra de linha serve para sinalizar o fim do strem dos dados
const parser = serial.pipe(new Readline({ delimiter: '\n' }));

// abre a conexão serial
serial.on('open', () => {
  console.log("Opened");
});

// identifica se houve erro ao abrir a conexão serial
serial.on('error', function( msg ) {
  console.log("First Serial port error: " + msg );
});

// recebe os dados do arduino
parser.on('data', (data) => {
  console.log(data)
  io.emit("test", data); // emite um evento ao socket
});

// abre conexao e envia os dados ao arduino
io.on("connection", (function (socket) {
  console.log('user connected');
  // ouve o evento e escreve o setpoint
  socket.on('client_data', function(setPoint){
    serial.write(JSON.stringify(setPoint));
  });
}));

// encerra conexão
io.on('disconnect', function() {
  console.log('disconnect');
})
