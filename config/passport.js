var LocalStrategy = require('passport-local').Strategy;

//==================================================================
// Define the strategy to be used by PassportJS
module.exports = function(passport,config){
  var authVal = config.get('System.credential');
  passport.use(new LocalStrategy(
    function(username, password, done) {
      //if (username === "admin" && password === "porco") // stupid example
      if (username == authVal.username && password == authVal.password)  
        return done(null, {name: "admin"});

    return done(null, false, { message: 'Incorrect username.' });
    }
  ));

  // Serialized and deserialized methods when got from session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};

