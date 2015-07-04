// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var passport       = require('passport');
var session        = require('express-session');
var cookieParser   = require('cookie-parser');
var flash          = require('connect-flash');
var config         = require('config');
var http           = require('http');
var https          = require('https');
var fs             = require('fs');
var crypto         = require('crypto');
// configuration ===========================================
var logs = require("./config/logger")(module);
require('./config/passport')(passport, config); // passport config
var dbConfig = config.get('System.dbConfig'); //dbConfig
var servConfig = config.get('System.servConfig'); //servConfig
// set our port and address
var HTTPport = servConfig.http_port;
var HTTPSport = servConfig.https_port;
var privatekey = servConfig.private_key;
var certificate = servConfig.certificate;
var ip_add = servConfig.ip;
// connect to our mongoDB database 
mongoose.connect(dbConfig.address);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error: '));
//Https Keys and certificate
var op = {
  key: fs.readFileSync(servConfig.private_key, 'utf8'),
  cert: fs.readFileSync(servConfig.certificate, 'utf8')
};
// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use("/libs", express.static(__dirname + '/libs'));

//read cookies (needed for auth)
app.use(cookieParser()); 

// set up ejs for templating
app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'embeddedmifaibuttareilsangue' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// use connect-flash for flash messages stored in session
app.use(flash());


// routes ==================================================
require('./app/routes')(app,passport); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(HTTPport);

// Start the server
/*
conn.once('open', function() {
  // Wait for the database connection to establish, then start the app.        
  logs.info('Connect to Mongodb on %s', dbConfig.address);
  //Http server
  var HTTPserver = http.createServer(app).listen(HTTPport, ip_add, function() {
   logs.info('Http Server is running on port: %d - ip address: %s', HTTPport, ip_add);
  });      
  //Https server to correctly run use root privilege
  var HTTPSserver = https.createServer(op, app).listen(HTTPSport, function(){
    logs.info('Https Server is running on port: %d - ip address: %s', HTTPSport, ip_add);
  }); 
});
*/


// expose app           
exports = module.exports = app; 
