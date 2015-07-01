var mongoose = require('mongoose');

var Sensor = require('./sensor');

var nodeSchema = new mongoose.Schema({
  id: String,
  address: String,
  connected: Boolean,
  sensors: [Sensor],
});

module.exports = mongoose.model('Node', nodeSchema);
