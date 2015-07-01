var mongoose = require('mongoose');

var measurementSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: Date,
  value: String,
});

module.exports = mongoose.model('Measurement', measurementSchema);
