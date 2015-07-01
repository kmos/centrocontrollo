var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
  id: String,
  type: String,
  measurements: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Sensor', sensorSchema);
