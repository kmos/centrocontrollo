var mongoose = require('mongoose');

var measurementSchema = new mongoose.Schema({
  _nodeId: {mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'node'
  },
  _sensorId: {mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'sensor'},
  timestamp: Date,
  value: String,
});

module.exports = mongoose.model('Measurement', measurementSchema);
