var SerialPort = require("serialport").SerialPort
var BitArray = require("bit-array");

var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 115200
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
 
    var varSend = new Buffer("ciao");
    var varlength = varSend.length;

    var lenBuffer = new Buffer(4);
    lenBuffer.writeUInt32BE(varlength, 0);

    serialPort.write(lenBuffer, function(err, results) {
      serialPort.drain(function(param) {
        console.log("drained: " + param);
      });
      if(err) console.log('err ' + err);
      console.log('results ' + results);
    });

    serialPort.on('data',function(data){
      console.log('data saluti: '+ data.readUInt32BE(0));
    });

    serialPort.on('error', function(param){
      console.log('on.error: '+ param);
    });

    serialPort.on('close', function(param){
      console.log('on.close: '+ param);
    });
  }
});
