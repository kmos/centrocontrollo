var Node = require('./models/node');
var Sensor = require('./models/sensor');
var Measurement = require('./models/measurement');

var board = require("../board");

function initSSE(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write("\n");

  return function(name, data) {
    res.write("event: " + name + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}

function getNodes(res){
  Node.find(function(err, nodes){
    if(err) res.send(err);
    res.json(nodes);
  });
};

module.exports = function(app,passport) {
  // Define a middleware function to be used for every secured routes
  var auth = function(req, res, next){
    if (!req.isAuthenticated()) 
      res.redirect('/api/login');
    else
      next();
  };

  app.get('/api/nodes/:nodeID', function(req, res) {
    Node.find({ _id: req.params.nodeID }, function(err, nodes) {
      if (err) {
        res.send(err);
      }

      res.json(nodes[0]);
    });
  });

  app.get('/api/nodes', function(req, res) {
    getNodes(res);
  });

  app.post('/api/nodes', function(req, res) {    
    Node.create({
      _id : req.body._id,
      address : req.body.address,
      secretKey : req.body.secret
    }, function(err, node){
      if(err) res.send(err);
      getNodes(res);
    });
  });
  
  app.put('/api/nodes/:nodeID', auth, function(req, res){
    Node.findById(req.params.nodeID, function(err, node){
      if(err) res.send(err);
      //in linea di massima non vanno modificati i parametri del nodo ma i sensori
      node.save(function(err){
      if(err) res.send(err);
      res.json({message: 'node update'});
      });
    });
  });
  
  app.delete('/api/nodes/:nodeID', function(req, res){
    Node.remove({_id: req.params.nodeID}, function(err, node){
      if(err) res.send(err);
      getNodes(res); 
    });
  });

  app.get("/api/alarms", function(req, res) {
    var sendEvent = initSSE(res);

    var receiveMeasurement = function(message) {
      if (message.alarm) {
        sendEvent("alarm", message);
      }
    };

    board.registerListener(receiveMeasurement, "measurement");

    req.once("end", function() {
      board.removeListener(receiveMeasurement, "measurement");
    });
  });

  app.get("/api/rt_measurements", function(req, res) {
    var sendEvent = initSSE(res);

    var receiveMeasurement = function(message) {
      sendEvent("measurement", message);
    };

    board.registerListener(receiveMeasurement, "measurement");

    req.once("end", function() {
      board.removeListener(receiveMeasurement, "measurement");
    });
  });

  app.get("/api/rt_measurements/:nodeID/:sensorID", function(req, res) {
    var sendEvent = initSSE(res);

    var receiveMeasurement = function(message) {
      sendEvent("measurement", message);
    };

    board.registerListener(receiveMeasurement, "measurement", req.params.nodeID, req.params.sensorID);

    req.once("end", function() {
      board.removeListener(receiveMeasurement, "measurement", req.params.nodeID, req.params.sensorID);
    });
  });

  app.get("/api/rt_measurements/launch/:nodeID/:sensorID", function(req, res) {
    board.askForMeasurement(req.params.nodeID, req.params.sensorID);
  });

  app.get('/api/measurement', auth, function(req, res){
    Measurement.find(function(err, measurements){
      if(err) res.send(err);
      res.json(measurements);
    });
  });
  
  app.get('/api/measurement:id_node', auth, function(req, res){
    Measurement.findOne({_nodeId: req.params.id_node}, function(err, measurement){
      if(err) res.send(err);
      if(!measurement) res.json('not found');

      res.json(measurement);
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

  app.get('/api/sensor/:sensorID', function(req, res) {
    Sensor.find({ _id: req.params.sensorID }, function(err, sensors) {
      if (err) {
        res.send(err);
      }

      res.json(sensors[0]);
    });
  });

  app.put('/api/sensor/:nodeID/:sensorID', function(req,res){
    
    Node.findById(req.params.nodeID, function(err, node){
      if(err){
        res.send(err);
      } 
      node.sensors[req.params.sensorID].klass = req.body.klass;
      node.sensors[req.params.sensorID].priority = req.body.priority;
      node.sensors[req.params.sensorID].lowThreshold = req.body.low;
      node.sensors[req.params.sensorID].highThreshold = req.body.high;
      node.sensors[req.params.sensorID].periodMs = req.body.period;

      node.save(function(err){
        if(err) res.send(err);
        res.json( { message: 'update config'});
      });
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
