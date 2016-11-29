const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cons = require('consolidate');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const logger = require('morgan');
const jwt = require('jwt-simple');
const request = require('request');
const mongoose = require('mongoose');
const moment = require('moment');
const qs = require('querystring');

require('dotenv').config();
require('handlebars');

console.log(__dirname);

var User = require('./models/user');

app.use(cors());

app.use( bodyParser.json() );  

app.use(bodyParser.urlencoded({     
  extended: true
})); 

mongoose.connect(process.env.MONGO_URL);


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, process.env.TOKEN_SECRET);
}


// /*
//  |--------------------------------------------------------------------------
//  | GET /api/me
//  |--------------------------------------------------------------------------
//  */
// app.get('/api/me', ensureAuthenticated, function(req, res) {
//   User.findById(req.user, function(err, user) {
//     res.send(user);
//   });
// });


//  |--------------------------------------------------------------------------
//  | PUT /api/me
//  |--------------------------------------------------------------------------
 
// app.put('/api/me', ensureAuthenticated, function(req, res) {
//   User.findById(req.user, function(err, user) {
//     if (!user) {
//       return res.status(400).send({ message: 'User not found' });
//     }
//     user.displayName = req.body.displayName || user.displayName;
//     user.email = req.body.email || user.email;
//     user.save(function(err) {
//       res.status(200).end();
//     });
//   });
// });


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
// app.post('/auth/login', function(req, res) {
//   User.findOne({ email: req.body.email }, '+password', function(err, user) {
//     if (!user) {
//       return res.status(401).send({ message: 'Invalid email and/or password' });
//     }
//     user.comparePassword(req.body.password, function(err, isMatch) {
//       if (!isMatch) {
//         return res.status(401).send({ message: 'Invalid email and/or password' });
//       }
//       res.send({ token: createJWT(user) });
//     });
//   });
// });

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
// app.post('/auth/signup', function(req, res) {
//   User.findOne({ email: req.body.email }, function(err, existingUser) {
//     if (existingUser) {
//       return res.status(409).send({ message: 'Email is already taken' });
//     }
//     var user = new User({
//       displayName: req.body.displayName,
//       email: req.body.email,
//       password: req.body.password
//     });
//     user.save(function(err, result) {
//       if (err) {
//         res.status(500).send({ message: err.message });
//       }
//       res.send({ token: createJWT(result) });
//     });
//   });
// });



/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
app.post('/auth/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }

        console.log(profile)

        User.findOrCreate({facebook:profile.id}, (err, user) => {
          if (err) { 
<<<<<<< HEAD
            console.log(err)
            return done(err); 
=======
            return console.log(err); 
>>>>>>> 5ab2b1624f5aa7ce5abd387a2ed892d94df79f49
          }

          user.displayName = profile.name;          
          user.email = profile.email;
          user.facebook = profile.id;

          console.log(user);

          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */

app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        token: accessToken.oauth_token,
        token_secret: accessToken.oauth_token_secret,
      };

      // Step 4. Retrieve user's profile information and email address.
      request.get({
        url: profileUrl,
        qs: { include_email: true },
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {
        // console.log(profile);
        // Step 5a. Link user accounts.
        // if (req.header('Authorization')) {
        //   User.findOne({ twitter: profile.id }, function(err, existingUser) {
        //     if (existingUser) {
        //       return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
        //     }
        //     console.log('log line 159')
        //     var token = req.header('Authorization').split(' ')[1];
        //     var payload = jwt.decode(token, process.env.TOKEN_SECRET);

        //     User.findById(payload.sub, function(err, user) {
        //       if (!user) {
        //         return res.status(400).send({ message: 'User not found' });
        //       }

        //       user.twitter = profile.id;
        //       user.email = profile.email;
        //       user.displayName = user.displayName || profile.name;
        //       user.picture = user.picture || profile.profile_image_url_https.replace('_normal', '');
        //       user.save(function(err) {
        //         res.send({ token: createJWT(user) });
        //       });
        //     });
        //   });
        // }
         // else {

        // Step 5b. Create a new user account or return an existing one.
        User.findOrCreate({ twitter: profile.id }, (err, user) => {
          if (err) {
<<<<<<< HEAD
            console.log(err)
            return done(err); 
=======
            return console.log(err); 
>>>>>>> 5ab2b1624f5aa7ce5abd387a2ed892d94df79f49
          }

          user.twitter      = profile.id;
          user.email        = null;
          user.displayName  = profile.name;

          console.log(user);
          // user.picture = profile.profile_image_url_https.replace('_normal', '');
          user.save(function() {
            res.send({ token: createJWT(user) });
          });
        });
        // }
      });
    });
  }
});


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Server running on port ' + port + '!');
})