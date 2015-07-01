var Node = require('./models/node');
var Sensor = require('./models/sensor');


module.exports = function(app,passport) {
  app.get('/api/nodes', function(req, res) {
    Node.find(function(err, nodes) {
      if (err) {
        res.send(err);
      }

      res.json(nodes);
    });
  });

  app.get('/api/monitor', function(req, res) {
    Sensor.find(function(err, measurements) {
      if (err) {
        res.send(err);
      }

      res.json(measurements);
    });
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/api/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
    // render the page and pass in any flash data if it exists
    res.render('../public/view/login.ejs', { message: req.flash('loginMessage') }); 
  });

  // process the login form
  app.post('/api/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/api/login',
    failureFlash: true
  }));

  app.post('/api/logout', function(req, res) {
    req.logOut();
    res.redirect('/api/login');
  });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);


  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html');
  });
};
