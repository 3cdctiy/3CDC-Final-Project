const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cons = require('consolidate');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config();
require('handlebars');

console.log(__dirname);

const User = require('./models/user');

app.use(cors());

app.use( bodyParser.json() );  

app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.use(expressSession({
    secret: 'crackalackin',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

  	User.findOrCreate({facebookID:profile.id}, function(err, user) {
      if (err) { return done(err); }
      
      user.name = profile.displayName;
      user.token = accessToken;
      user.save();

      done(null, user);
    });
  }
));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views')

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

// Stubbed login example
app.get('/',(req,res) =>{
  res.render('index', {token: req.user.token})
})

// Stubbed login example
app.get('/login',(req,res) =>{
	res.render('login')
})

// Stubbed dashboard example
app.get('/getUser',(req,res) =>{
  res.json(req.user.token);
	// res.json(req.user);
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
	successRedirect: '/',
	failureRedirect: '/login' 
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



// View restricted to authenticated users
// app.post('',isAuthenticated,(req, res) => {
	
// })

// View open to all
// app.post('',(req, res) => {
	
// })



function isAuthenticated(req, res, next) {
    if (req.user)
        return next();
    res.redirect('/login');
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server running on port ' + port + '!');
})