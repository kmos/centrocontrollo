var mongoose = require('mongoose');

var Measurement = require('./measurement');

var sensorSchema = new mongoose.Schema({
  _id: String,
  klass: String,
  priority: Number,
  alarm: Boolean,
  lowThreshold: Number,
  highThreshold: Number,
  periodMs: Number,
  measurements: [ Measurement.schema ]
});

module.exports = mongoose.model('Sensor', sensorSchema);
