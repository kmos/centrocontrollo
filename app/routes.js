var Node = require('./models/node');
var passport = require('passport');

module.exports = function(app) {
// Define a middleware function to be used for every secured routes
  var auth = function(req, res, next){
    if (!req.isAuthenticated()) 
      res.send(401);
    else
      next();
  };
//==================================================================

  app.get('/api/nodes', function(req, res) {
    Node.find(function(err, nodes) {
      if (err) {
        res.send(err);
      }

      res.json(nodes);
    });
  });

  app.get('/nodes', auth, function(req, res){
    res.send([{name: "node1"}, {name: "node2"}]);
  });
//==================================================================

//==================================================================
// route to test if the user is logged in or not
  app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });

// route to log in
  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
  });

// route to log out
  app.post('/logout', function(req, res){
    req.logOut();
    res.send(200);
  });
//==================================================================


  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html');
  });
};
