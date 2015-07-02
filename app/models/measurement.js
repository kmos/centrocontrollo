var mongoose = require('mongoose');

var measurementSchema = new mongoose.Schema({
  timestamp: Date,
  value: String,
});

module.exports = mongoose.model('Measurement', measurementSchema);
