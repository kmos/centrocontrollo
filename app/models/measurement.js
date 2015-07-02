var mongoose = require('mongoose');

var measurementSchema = new mongoose.Schema({
  _nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'node'
  },
  _sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'sensor'
  },
  timestamp: Date,
  value: String,
});

module.exports = mongoose.model('Measurement', measurementSchema);
