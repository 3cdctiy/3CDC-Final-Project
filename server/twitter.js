// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');
// const cons = require('consolidate');
// const passport = require('passport');
// const TwitterStrategy = require('passport-twitter').Strategy;


// require('dotenv').config();
// require('handlebars');

// console.log(__dirname);

// const User = require('./models/user');

// app.use(cors());

// app.use( bodyParser.json() );  

// app.use(bodyParser.urlencoded({     
//   extended: true
// })); 

// app.use(expressSession({
//     secret: 'crackalackin',
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new Strategy({
//     consumerKey: process.env.CONSUMER_KEY,
//     consumerSecret: process.env.CONSUMER_SECRET,
//     callbackURL: 'http://localhost:5000/auth/twitter/callback'
//   },
//   function(token, tokenSecret, profile, cb) {

//   	User.findOrCreate({twitterID:id}, function(err, user) {
//       if (err) { return done(err); }
      
//       user.name = name;
//       user.token = accessToken;
//       user.save();

//       done(null, profile);
//     });
//   }
// ));

// app.set('view engine', 'hbs');
// app.set('views', __dirname + '/views')

// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URL);

// // Stubbed login example
// app.get('/',(req,res) =>{
//   res.render('index', {token: req.user.token})
// })

// // Stubbed login example
// app.get('/login',(req,res) =>{
// 	res.render('login')
// })

// // Stubbed dashboard example
// app.get('/getUser',(req,res) =>{
//   res.json(req.user.token);
// 	// res.json(req.user);
// })

// app.get('/auth/twitter', passport.authenticate('twitter'));

// app.get('/auth/twitter/callback', passport.authenticate('twitter', { 
// 	successRedirect: '/',
// 	failureRedirect: '/login' 
// }));

// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });



// // View restricted to authenticated users
// // app.post('',isAuthenticated,(req, res) => {
	
// // })

// // View open to all
// // app.post('',(req, res) => {
	
// // })



// function isAuthenticated(req, res, next) {
//     if (req.user)
//         return next();
//     res.redirect('/login');
// }

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log('Server running on port ' + port + '!');
// })