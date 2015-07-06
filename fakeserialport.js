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
      var message = {
        type: "measurement",
        nodeId: Math.floor(Math.random() * 5),
        sensorId: Math.floor(Math.random() * 5),
        timestamp: Date.now(),
        value: Math.floor(Math.random() * 100),
        alarm: false,
      };

      this.eventHandlers["data"] && this.eventHandlers["data"](new Buffer(JSON.stringify(message)));
    }).bind(this), 5000);

    // Send a fake alarm every 10 seconds
    setInterval((function() {
      var message = {
        type: "measurement",
        nodeId: Math.floor(Math.random() * 5),
        sensorId: Math.floor(Math.random() * 5),
        timestamp: Date.now(),
        value: Math.floor(Math.random() * 100),
        alarm: true,
      };

      this.eventHandlers["data"] && this.eventHandlers["data"](new Buffer(JSON.stringify(message)));
    }).bind(this), 10000);

    // Send a fake canJoin request every 20 seconds
    setInterval((function() {
      var message = {
        type: "canJoin",
        nodeID: Math.floor(Math.random() * 100),
      };

      this.eventHandlers["data"] && this.eventHandlers["data"](new Buffer(JSON.stringify(message)));
    }).bind(this), 20000);
  }).bind(this), 0);
};

FakeSerialPort.prototype.write = function(buffer, callback) {
  setTimeout((function() {
    var message = JSON.parse(buffer);

    var reply;

    if (message.type === "measurement") {
      reply = {
        type: "measurement",
        nodeId: message.nodeID,
        sensorId: message.sensorID,
        timestamp: Date.now(),
        value: Math.floor(Math.random() * 100),
        alarm: Math.floor(Math.random() * 2) ? true : false,
      };
    } else if (message.type === "canJoin") {
      if (message.reply === 1) {
        reply = {
          type: "join",
          nodeID: message.nodeID,
        };
      } else {
        console.log("noCanJoin!");
      }
    }

    if (reply) {
      this.eventHandlers["data"] && this.eventHandlers["data"](new Buffer(JSON.stringify(reply)));
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