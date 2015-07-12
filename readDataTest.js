var mongoose       = require('mongoose');
var config         = require('config');
var board          = require('./board');
var Node           = require('./app/models/node');
var logs = require("./config/logger")(module);

var dbConfig = config.get('System.dbConfig'); //dbConfig

mongoose.connect(dbConfig.address);

mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

mongoose.connection.once("open", function() {
  logs.info('Connect to Mongodb on %s', dbConfig.address);

  function logMessage(message) {
    console.log("received: " + JSON.stringify(message));
  }

  board.registerListener(logMessage, "measurement");

  board.registerListener(function(message) {
    logMessage(message);

    var nullSecretKey = new Buffer(16);
    nullSecretKey.fill(0);

    setTimeout(function() {
      board.replyCanJoin(message.nodeID, nullSecretKey,  /* address */ 1, function() {
        console.log("CANJOINREPLY packet sent");
      });
    }, 5000);
  }, "canJoin");

  board.registerListener(logMessage, "join");

  setInterval(function() {
    board.askForMeasurement("AAAAAAAAAAAAAAAA", "0", function() {
      console.log("READDATA packet sent");
    });
  }, 5000);

  setInterval(function() {
    board.sendConfig("0", "0", 1, 100, 0, 1000, 0);
  }, 10000);
});
