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
// configuration ===========================================
    
// config files
require('./config/passport')(passport,config); // passport config
var dbConfig = config.get('System.dbConfig');

// set our port
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
mongoose.connect(dbConfig.address);

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
app.listen(port);               

console.log('Listening on port ' + port);

// expose app           
exports = module.exports = app; 
