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
      var buffer = new Buffer("aValue");
      this.eventHandlers["data"] && this.eventHandlers["data"](buffer);
    }).bind(this), 5000);
  }).bind(this), 0);
};

FakeSerialPort.prototype.write = function(buffer, callback) {
  setTimeout(function() {
    callback();
  }, 0);
};

FakeSerialPort.prototype.drain = function(callback) {
  setTimeout(function() {
    callback();
  }, 0);
};

module.exports = FakeSerialPort;