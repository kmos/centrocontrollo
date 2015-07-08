var mongoose = require('mongoose');

var Sensor = require('./sensor');

var nodeSchema = new mongoose.Schema({
  _id: String,
  secretKey: String,
  address: String,
  connected: Boolean,
  sensors: [ Sensor.schema ],
});

module.exports = mongoose.model('Node', nodeSchema);
