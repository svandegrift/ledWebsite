var express = require('express');
var socket_io = require('socket.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SerialPort = require("serialport");
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.io = socket_io();
var port = new SerialPort("COM3",{baudRate:9600, parser: SerialPort.parsers.readline('\n')});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//SERIAL PORT//
port.on('open',function(){
  console.log('port Opened');
  function sendColor(color){
    port.write(color + '\n', function(err, res){
      if(err){console.log(err)};
    });
  }
    //SOCKET.IO BOX//
  app.io.on("connection", function(socket){
    socket.on('sendPulse', function(color){
      sendColor(color);
    });
    socket.emit('server');
    port.on('data',function(data){
      if(data.trim() == "Pushed"){
        socket.emit("button");
        console.log("code sent");
      }
    });
  });
});


module.exports = app;
