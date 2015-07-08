var config     = require('config');
var SerialPort = require('serialport');

var serialPort = new SerialPort(config.get('System.serial.port'), {
  baudrate: config.get('System.serial.baudrate')
}, false);

serialPort.open(function(err) {
  if (err) {
    console.log('Error opening serial: ' + err);
    return;
  }

  serialPort.on('data', function(buffer) {
    console.log(buffer);
  });

  setInterval(function() {
    var buffer = new Buffer(14);

    buffer.writeUInt8(0, 0);     // OPCode
    buffer.writeUInt8(0, 1);     // Sensor ID
    buffer.writeUInt8(0, 2);     // Alarm
    buffer.writeUInt32BE(0, 3);  // High threshold
    buffer.writeUInt32BE(0, 7);  // Low threashold
    buffer.writeUInt16BE(0, 11); // Period
    buffer.writeUInt8(0, 13);    // Priority

    serialPort.write(buffer, function() {
      console.log("Request sent.");
    });
  }, 5000);
});
