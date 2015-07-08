var config     = require('config');
var SerialPort = require('./fakeserialport');
var Node       = require('./app/models/node');

const OFFSET_TYPE = 0;
const OFFSET_START = 1;
const READDATA_PACKET_TYPE = 0x00;
const DATA_PACKET_TYPE = 0x02;
const CANJOIN_PACKET_TYPE = 0x03;

var Board = function() {
  this.eventListeners = {};

  var callListeners = (function(msg) {
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

  var receiveMessage = function(buffer) {
    var packetType = buffer.readUInt8(OFFSET_TYPE);

    switch (packetType) {
      case DATA_PACKET_TYPE:
        var nodeAddress = buffer.readUInt16BE(OFFSET_START);

        // XXX: Fix callers to expect a node address instead of a node ID.
        Node.find({
          address: nodeAddress,
        }, function(err, nodes) {
          if (err) {
            console.log("Error while retrieving node: " + err);
            return;
          }

          if (nodes.length === 0) {
            console.log("No nodes found with address = " + nodeAddress);
            return;
          }

          callListeners({
            type: "measurement",
            nodeId: nodes[0]._id,
            sensorId: buffer.readUInt8(OFFSET_START + 2),
            timestamp: buffer.readUInt32BE(OFFSET_START + 3),
            value: buffer.readUInt32BE(OFFSET_START + 7),
            alarm: buffer.readUInt8(OFFSET_START + 11),
          });
        });

        break;

      case CANJOIN_PACKET_TYPE:
        callListeners({
          type: "canJoin",
          nodeID: buffer.slice(1).toString('base64'),
        });
      break;

      default:
        console.log("RECEIVED UNSUPPORTED MESSAGE");
        console.log(buffer);
    }
  };

  this.serialPort = new SerialPort(config.get('System.serial.port'), {
    baudrate: config.get('System.serial.baudrate')
  }, false);

  this.serialPort.open((function(err) {
    if (err) {
      console.log('Error opening serial: ' + err);
      return;
    }

    this.serialPort.on('data', receiveMessage);
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
  // XXX: Fix callers to use a node address instead of a node ID.
  Node.find({
    _id: nodeID,
  }, (function(err, nodes) {
    if (err) {
      console.log("Error while retrieving node: " + err);
      return;
    }

    if (nodes.length === 0) {
      console.log("No nodes found with ID = " + nodeID);
      return;
    }

    var buffer = new Buffer(OFFSET_START + 3);

    buffer.writeUInt8(READDATA_PACKET_TYPE, OFFSET_TYPE);
    buffer.writeUInt16BE(nodes[0].address, OFFSET_START);
    buffer.writeUInt8(sensorID, OFFSET_START + 2);

    this.serialPort.write(buffer, callback);
  }).bind(this));
};

Board.prototype.replyCanJoin = function(nodeID, reply, callback) {
  /*var message = JSON.stringify({
    type: "canJoin",
    nodeID: nodeID,
    reply: reply ? 1 : 0,
  });

  this.serialPort.write(message, callback);*/
};

module.exports = new Board();
