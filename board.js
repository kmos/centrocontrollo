var config     = require('config');
var SerialPort = require('./fakeserialport');

var Board = function() {
  this.eventListeners = {};

  var callListeners = (function(data) {
    var msg = JSON.parse(data);

    if (!this.eventListeners[msg.type]) {
      return;
    }

    this.eventListeners[msg.type].callbacks.forEach(function(cb) {
      cb(msg);
    });

    if (!this.eventListeners[msg.type][msg.nodeId]) {
      return;
    }

    this.eventListeners[msg.type][msg.nodeId].callbacks.forEach(function(cb) {
      cb(msg);
    });

    if (!this.eventListeners[msg.type][msg.nodeId][msg.sensorId]) {
      return;
    }

    this.eventListeners[msg.type][msg.nodeId][msg.sensorId].forEach(function(cb) {
      cb(msg);
    });
  }).bind(this);

  this.serialPort = new SerialPort(config.get('System.serial.port'), {
    baudrate: config.get('System.serial.baudrate')
  }, false);

  this.serialPort.open((function(err) {
    if (err) {
      console.log('Error opening serial: ' + err);
      return;
    }

    this.serialPort.on('data', function(data) {
      callListeners(data);
    });
  }).bind(this));
};

Board.prototype.registerListener = function(callback, what, nodeId, sensorId) {
  if (!this.eventListeners[what]) {
    this.eventListeners[what] = {
      callbacks: [],
    };
  }

  if (!nodeId) {
    this.eventListeners[what].callbacks.push(callback);
    return;
  }

  if (!this.eventListeners[what][nodeId]) {
    this.eventListeners[what][nodeId] = {
      callbacks: [],
    };
  }

  if (!sensorId) {
    this.eventListeners[what][nodeId].callbacks.push(callback);
    return;
  }

  if (!this.eventListeners[what][nodeId][sensorId]) {
    this.eventListeners[what][nodeId][sensorId] = [];
  }

  this.eventListeners[what][nodeId][sensorId].push(callback);
};

Board.prototype.removeListener = function(callback, what, nodeId, sensorId) {
  // TODO: Remove listener
};

Board.prototype.askForMeasurement = function(nodeID, sensorID, callback) {
  var message = JSON.stringify({
    type: "measurement",
    nodeID: nodeID,
    sensorID: sensorID,
  });

  this.serialPort.write(message, callback);
};

module.exports = new Board();