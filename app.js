var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var localMongoose = require('passport-local-mongoose');
var app = express();

//*** MODELS REQUIREMENTS ***
var User = require('./models/users');
//***********************//

mongoose.connect('mongodb://localhost/auth_app');



app.use(bodyParser.urlencoded({ extended : false }))
//*** SETTING UP PASSPORT AND EXPRESS SESSION ***

app.use(require('express-session')({
  secret:'I like to fuck bitches, man!',
  resave: false,
  saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//******************************************//



app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname + '/public'));


//******* APP ROUTES CONFIGURATION ********//
app.get('/', function(req, res){
  res.redirect('/home');
})

app.get('/home', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.get('/secret', isLoggedIn , function(req, res){
  res.render('secret');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})



//***USER REGISTRATION ***
app.post('/registration', function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, result){
    if (err) {
      console.log(err);
    }
    else{
      passport.authenticate('local')(req, res, function(){
        res.redirect('/login');
      });
    }
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}), function(req, res){

});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


//*** APP PORT CONFIG ***//
var port = (process.env.PORT || 8080);
//************************//



//*** server runner ***
app.listen(port, function(){
    console.log('Server running on port ' + port + ' At: ' + moment().format('LT'));
});
