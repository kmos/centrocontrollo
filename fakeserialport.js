const OFFSET_TYPE = 0;
const OFFSET_START = 1;
const READDATA_PACKET_TYPE = 0x00;
const DATA_PACKET_TYPE = 0x02;
const CANJOIN_PACKET_TYPE = 0x03;
const CANJOINREPLY_PACKET_TYPE = 0x04;
const JOIN_PACKET_TYPE = 0x05;

function buildMeasurementPacket(nodeAddress, sensorID, alarm) {
  var reply = new Buffer(OFFSET_START + 12);

  reply.writeUInt8(DATA_PACKET_TYPE, OFFSET_TYPE);
  reply.writeUInt16LE(nodeAddress, OFFSET_START);
  reply.writeUInt8(sensorID, OFFSET_START + 2);
  reply.writeUInt32LE(Date.now() | 0, OFFSET_START + 3);
  reply.writeUInt32LE(Math.floor(Math.random() * 100), OFFSET_START + 7);
  reply.writeUInt8(alarm, OFFSET_START + 11);

  return reply;
}

function buildCanJoinPacket(nodeID) {
  var reply = new Buffer(OFFSET_START + 12);

  reply.writeUInt8(CANJOIN_PACKET_TYPE, OFFSET_TYPE);

  var nodeIDBytes = new Buffer(nodeID);
  nodeIDBytes.copy(reply, OFFSET_START);

  return reply;
}

function buildJoinPacket(nodeIDBytes) {
  var reply = new Buffer(OFFSET_START + 12);

  reply.writeUInt8(JOIN_PACKET_TYPE, OFFSET_TYPE);

  nodeIDBytes.copy(reply, OFFSET_START);

  return reply;
}

var FakeSerialPort = function(path, options) {
  this.eventHandlers = {};
};

FakeSerialPort.prototype.on = function(what, callback) {
  this.eventHandlers[what] = callback;
}

FakeSerialPort.prototype.open = function(callback) {
  setTimeout((function() {
    callback();
    this.eventHandlers["open"] && this.eventHandlers["open"]();

    // Send a fake measurement every 5 seconds
    setInterval((function() {
      var message = buildMeasurementPacket(Math.floor(Math.random() * 5),
                                           Math.floor(Math.random() * 5),
                                           0);

      this.eventHandlers["data"] && this.eventHandlers["data"](message);
    }).bind(this), 5000);

    // Send a fake alarm every 10 seconds
    setInterval((function() {
      var message = buildMeasurementPacket(Math.floor(Math.random() * 5),
                                           Math.floor(Math.random() * 5),
                                           1);

      this.eventHandlers["data"] && this.eventHandlers["data"](message);
    }).bind(this), 10000);

    // Send a fake canJoin request every 20 seconds
    setInterval((function() {
      var nodeID = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 100)];
      var message = buildCanJoinPacket(nodeID);

      this.eventHandlers["data"] && this.eventHandlers["data"](message);
    }).bind(this), 2000);
  }).bind(this), 0);
};

FakeSerialPort.prototype.write = function(buffer, callback) {
  var packetType = buffer.readUInt8(OFFSET_TYPE);

  var reply;

  switch (packetType) {
    case READDATA_PACKET_TYPE:
      var nodeAddress = buffer.readUInt16LE(OFFSET_START);
      var sensorID = buffer.readUInt8(OFFSET_START + 2);

      reply = buildMeasurementPacket(nodeAddress, sensorID, Math.floor(Math.random() * 2));
    break;

    case CANJOINREPLY_PACKET_TYPE:
      var nodeID = buffer.slice(OFFSET_START, OFFSET_START + 12);
      var secretKey = buffer.slice(OFFSET_START + 12, OFFSET_START + 28);
      var nodeAddress = buffer.readUInt16LE(OFFSET_START + 28);

      var isNull = true;
      for (var i = 0; i < 16; i++) {
        if (secretKey[i] !== 0) {
          isNull = false;
        }
      }

      if (!isNull) {
        reply = buildJoinPacket(nodeID);
      } else {
        console.log("noCanJoin!");
      }
    break;

    default:
      console.log("FakeSerialPort received an unknown packet: " + packetType);
  }

  setTimeout((function() {
    if (reply) {
      this.eventHandlers["data"] && this.eventHandlers["data"](reply);
    }

    callback && callback();
  }).bind(this), 5000);
};

FakeSerialPort.prototype.drain = function(callback) {
  setTimeout(function() {
    callback();
  }, 0);
};

module.exports = FakeSerialPort;