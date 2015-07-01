var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
  id: String,
  sclass: String,
  priority: Number,
  alarm: Boolean,
  LowThreshold: Number,
  HighThreshold: Number,
  period_ms: Number
});

module.exports = mongoose.model('Sensor', sensorSchema);
