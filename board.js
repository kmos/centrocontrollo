var config     = require('config');
var SerialPort = require('./fakeserialport');
//var SerialPort = require('serialport').SerialPort;
var Node       = require('./app/models/node');

const OFFSET_TYPE = 0;
const OFFSET_START = 1;
const READDATA_PACKET_TYPE = 0x00;
const READDATA_PACKET_LENGTH = 4;
const CONFIGSENSOR_PACKET_TYPE = 0x01;
const CONFIGSENSOR_PACKET_LENGTH = 16;
const DATA_PACKET_TYPE = 0x02;
const DATA_PACKET_LENGTH = 13;
const CANJOIN_PACKET_TYPE = 0x03;
const CANJOIN_PACKET_LENGTH = 13;
const CANJOINREPLY_PACKET_TYPE = 0x04;
const CANJOINREPLY_PACKET_LENGTH = 31;
const JOIN_PACKET_TYPE = 0x05;
const JOIN_PACKET_LENGTH = 13;
const LOG_PACKET_TYPE = 0x06;
const LOG_PACKET_LENGTH = 129;

var packetLengths = {
  0: READDATA_PACKET_LENGTH,
  1: CONFIGSENSOR_PACKET_LENGTH,
  2: DATA_PACKET_LENGTH,
  3: CANJOIN_PACKET_LENGTH,
  4: CANJOINREPLY_PACKET_LENGTH,
  5: JOIN_PACKET_LENGTH,
  6: LOG_PACKET_LENGTH,
};

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

  // Cache zeroBuffer so we don't need to create it too often.
  var zeroBuffer = new Buffer(0);
  var oldBuffer = new Buffer(0);

  var receiveMessage = function(buffer) {
    if (oldBuffer.length > 0) {
      buffer = Buffer.concat([oldBuffer, buffer]);
      oldBuffer = zeroBuffer;
    }

    var received = buffer.length;

    var packetLength = 0;

    while (received != 0) {
      var packetType = buffer.readUInt8(OFFSET_TYPE);
      packetLength = packetLengths[packetType] || 0;

      if (packetLength > received) {
        oldBuffer = Buffer.concat([oldBuffer, buffer]);
        break;
      }

      switch (packetType) {
        case DATA_PACKET_TYPE:
          var nodeAddress = buffer.readUInt16LE(OFFSET_START);
          var sensorID = buffer.readUInt8(OFFSET_START + 2);
          var timestamp = buffer.readUInt32LE(OFFSET_START + 3);
          var value = buffer.readUInt32LE(OFFSET_START + 7);
          var alarm = buffer.readUInt8(OFFSET_START + 11);

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
              sensorId: sensorID,
              timestamp: timestamp,
              value: value,
              alarm: alarm,
            });
          });

          break;

        case CANJOIN_PACKET_TYPE:
          callListeners({
            type: "canJoin",
            nodeID: buffer.slice(OFFSET_START, OFFSET_START + 12).toString('base64'),
          });
        break;

        case JOIN_PACKET_TYPE:
          callListeners({
            type: "join",
            nodeID: buffer.slice(OFFSET_START, OFFSET_START + 12).toString('base64'),
          });
        break;

        case LOG_PACKET_TYPE:
          callListeners({
            type: "log",
            line: buffer.slice(OFFSET_START, OFFSET_START + 128).toString('ascii').split("\n")[0],
          });
        break;

        default:
          console.log("RECEIVED UNSUPPORTED MESSAGE: " + packetType);
          console.log(buffer);
          oldBuffer = zeroBuffer;
      }

      if (received > packetLength) {
        received -= packetLength;
        buffer = buffer.slice(packetLength);
      } else {
        break;
      }
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

    var buffer = new Buffer(READDATA_PACKET_LENGTH);

    buffer.writeUInt8(READDATA_PACKET_TYPE, OFFSET_TYPE);
    buffer.writeUInt16LE(nodes[0].address, OFFSET_START);
    buffer.writeUInt8(sensorID, OFFSET_START + 2);

    this.serialPort.write(buffer, callback);
  }).bind(this));
};

Board.prototype.replyCanJoin = function(nodeID, secretKey, nodeAddress, callback) {
  var buffer = new Buffer(CANJOINREPLY_PACKET_LENGTH);

  buffer.writeUInt8(CANJOINREPLY_PACKET_TYPE, OFFSET_TYPE);

  var nodeIDBytes = new Buffer(nodeID, "base64");
  nodeIDBytes.copy(buffer, OFFSET_START);

  var secretKeyBytes = new Buffer(secretKey, "base64");
  secretKeyBytes.copy(buffer, OFFSET_START + 12);

  buffer.writeUInt16LE(nodeAddress, OFFSET_START + 28);

  this.serialPort.write(buffer, callback);
};

Board.prototype.sendConfig = function(nodeAddress, sensorID, alarm, highThreshold, lowThreshold, period, priority, callback) {
  var buffer = new Buffer(CONFIGSENSOR_PACKET_LENGTH);

  buffer.writeUInt8(CONFIGSENSOR_PACKET_TYPE, OFFSET_TYPE);

  buffer.writeUInt16LE(nodeAddress, OFFSET_START);
  buffer.writeUInt8(sensorID, OFFSET_START + 2);
  buffer.writeUInt8(alarm, OFFSET_START + 3);
  buffer.writeUInt32LE(highThreshold, OFFSET_START + 4);
  buffer.writeUInt32LE(lowThreshold, OFFSET_START + 8);
  buffer.writeUInt16LE(period, OFFSET_START + 12);
  buffer.writeInt8(priority, OFFSET_START + 14);

  this.serialPort.write(buffer, callback);
};

module.exports = new Board();
