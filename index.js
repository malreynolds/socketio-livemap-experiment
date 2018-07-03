var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const _ = require("lodash");
const { Connections } = require('./connections');
const { Container } = require('./container');


var connections = new Connections();
var container = new Container(connections, io);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    connections.removeConnection(socket.id);
    console.log('user disconnected');
    console.log(connections);
  });
  socket.on('init_devices', function(data){
    connections.addConnection(socket.id, data);
    console.log(connections);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// Test
const THIRTY_SECONDS = 3000;
const NUM_DEVICES = 25;
let device_ids = _.range(1, NUM_DEVICES);
let initial_data = []
for (var i = 1; i <= NUM_DEVICES; i++) {
  initial_data.push({
    id: i,
    lat: _.random(-90, 90, true),
    lon: _.random(-180, 180, true),
  })
}

container.initDeviceData(initial_data);

setInterval(() => {
    let num_updates = Math.floor(Math.random() * NUM_DEVICES) + 1;
    var shuffled = _.shuffle(device_ids);
    let update_ids = shuffled.slice(0, num_updates);
    let update_data = []
    for (var i = 0; i < num_updates; i++) {
      update_data.push({
        id: update_ids[i],
        lat: _.random(-90, 90, true),
        lon: _.random(-180, 180, true),
      })
    }
    container.updateDevices(update_data);
}, THIRTY_SECONDS);