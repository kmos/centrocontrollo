var config   = require('config');
var mongoose = require('mongoose');

before(function(done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }

    done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.get('System.dbConfig').address, function(err) {
      if (err) {
        throw err;
      }

      clearDB();
    });
  } else {
    clearDB();
  }
});

after(function(done) {
  mongoose.disconnect();
  done();
});
