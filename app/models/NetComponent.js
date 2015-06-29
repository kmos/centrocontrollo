// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var NetComponentSchema   = new mongoose.Schema({
  name: String,
  type: String,
  netCompId: String
});

// Export the Mongoose model
module.exports = mongoose.model('NetComponent', NetComponentSchema);

