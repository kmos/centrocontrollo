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

    setInterval((function() {
      var message = {
        type: "measurement",
        nodeId: Math.floor(Math.random() * 5),
        sensorId: Math.floor(Math.random() * 5),
        timestamp: Date.now(),
        value: Math.floor(Math.random() * 100),
      };

      this.eventHandlers["data"] && this.eventHandlers["data"](new Buffer(JSON.stringify(message)));
    }).bind(this), 5000);
  }).bind(this), 0);
};

FakeSerialPort.prototype.write = function(buffer, callback) {
  setTimeout((function() {
    var message = JSON.parse(buffer);

    if (message.type === "measurement") {
      var reply = {
        type: "measurement",
        nodeId: message.nodeID,
        sensorId: message.sensorID,
        timestamp: Date.now(),
        value: Math.floor(Math.random() * 100),
      };

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