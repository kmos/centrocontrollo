var mongoose = require('mongoose');

var nodeSchema = new mongoose.Schema({
  id: String,
  address: String,
  connected: Boolean,
  sensors: [],
});

module.exports = mongoose.model('Node', nodeSchema);
