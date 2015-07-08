const OFFSET_TYPE = 0;
const OFFSET_START = 1;
const READDATA_PACKET_TYPE = 0x00;
const DATA_PACKET_TYPE = 0x02;

function buildMeasurementPacket(nodeAddress, sensorID, alarm) {
  var reply = new Buffer(OFFSET_START + 12);

  reply.writeUInt8(DATA_PACKET_TYPE, OFFSET_TYPE);
  reply.writeUInt16BE(nodeAddress, OFFSET_START);
  reply.writeUInt8(sensorID, OFFSET_START + 2);
  reply.writeUInt32BE(Date.now() | 0, OFFSET_START + 3);
  reply.writeUInt32BE(Math.floor(Math.random() * 100), OFFSET_START + 7);
  reply.writeUInt8(alarm, OFFSET_START + 11);

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
    /*setInterval((function() {
      var message = {
        type: "canJoin",
        nodeID: Math.floor(Math.random() * 100),
      };

      this.eventHandlers["data"] && this.eventHandlers["data"](new Buffer(JSON.stringify(message)));
    }).bind(this), 20000);*/
  }).bind(this), 0);
};

FakeSerialPort.prototype.write = function(buffer, callback) {
  var packetType = buffer.readUInt8(OFFSET_TYPE);

  var reply;

  if (packetType === READDATA_PACKET_TYPE) {
    var nodeAddress = buffer.readUInt16BE(OFFSET_START);
    var sensorID = buffer.readUInt8(OFFSET_START + 2);

    reply = buildMeasurementPacket(nodeAddress, sensorID, Math.floor(Math.random() * 2));
  }

  setTimeout((function() {
    /*var message = JSON.parse(buffer);

    if (message.type === "measurement") {

    } else if (message.type === "canJoin") {
      if (message.reply === 1) {
        reply = {
          type: "join",
          nodeID: message.nodeID,
        };
      } else {
        console.log("noCanJoin!");
      }
    }*/

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