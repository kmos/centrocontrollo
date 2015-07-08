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

  board.registerListener(function(message) {
    Node.find({
      _id: message.nodeId,
    }, function(err, nodes) {
      if (err) {
        logs.error("Error while querying nodes: " + err);
        return;
      }

      if (nodes.length === 0) {
        logs.error("Node not found");
        return;
      }

      console.log("MEASUREMENT: " + JSON.stringify(message));
    });
  }, "measurement");

  board.askForMeasurement("AAAAAAAAAAAAAAAA", "0", function() {
    console.log("READDATA packet sent");
  });
});
