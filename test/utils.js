var db = require('../config/db');
var mongoose = require('mongoose');

beforeEach(function(done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }

    done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(db.url, function(err) {
      if (err) {
        throw err;
      }

      clearDB();
    });
  } else {
    clearDB();
  }
});

afterEach(function(done) {
  mongoose.disconnect();
  done();
});
