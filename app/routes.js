var Node = require('./models/node');
var Sensor = require('./models/sensor');


module.exports = function(app,passport) {
  
  // Define a middleware function to be used for every secured routes
  var auth = function(req, res, next){
    if (!req.isAuthenticated()) 
      res.redirect('/api/login');
    else
      next();
  };

  app.get('/api/nodes', function(req, res) {
    Node.find(function(err, nodes) {
      if (err) {
        res.send(err);
      }

      res.json(nodes);
    });
  });

  app.post('/api/nodes', function(req, res) {
    var node = new Node();
    node.id = req.body.id;

    node.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Node created!' });
    });
  });
  
  app.put('/api/nodes', auth, function(req, res){
    Node.findById(req.params.node_id, function(err, node){
      if(err) res.send(err);
      //in linea di massima non vanno modificati i parametri del nodo ma i sensori
      node.save(function(err){
      if(err) res.send(err);
      res.json({message: 'node update'});
      });
    });
  });
  
  app.delete(function(req, res){
    Node.remove({_id: req.params.node_id}, function(err, node){
      if(err) res.send(err);
      res.json({ message: 'Successfully deleted'});
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
  app.get('/api/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('../public/views/login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/api/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/api/login',
    failureFlash: true
  }));

  app.get('/api/logout', function(req, res) {
    req.logout();
    res.redirect('/api/login');
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);


  app.get('*',auth, function(req, res) {
    res.sendfile('./public/views/index.html');
  });

  //==================================================================
};
