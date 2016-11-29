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
            return done(err); 
          }

          user.displayName = profile.name;          
          user.email = profile.email;
          user.facebook = profile.id;

          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
    });
  });
});



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Server running on port ' + port + '!');
})