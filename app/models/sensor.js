var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
  id: String,
  type: String,
  value: String,
});

module.exports = mongoose.model('Sensor', sensorSchema);
