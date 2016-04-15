var express = require('express');
var router = express.Router();
var moment = require('moment');
var jwt = require('jwt-simple');

var User = require('../models/user');
var config = require('../../_config');


router.post('/register', function(req, res, next) {
  // ensure user does not exist
  User.findById({email: req.body.email}, function(err, existingUser){
    if(err){
      return next(err);
    }
    if(existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already exists'
      });
    }
  // create new user
    var user = new User(req.body);
    user.save(function() {
      // create token 
      var token = generateToken(user);
      res.status(200).json({
        status: 'success',
        data: {
          token: token,
          user: user.email
        }
      });
    });

  });

});

router.post('/login', function(req, res, next) {
  // ensure user exists
  User.findById({email: req.body.email}, function(err, user){
    if(err){
      return next(err);
    }
    if(!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email and/or Password is incorrect.'
      });
    }
    // compare plain text password with the hashed/salted password
    user.comparePassword(req.body.password, function(err, match) {
      if(err){
        return next(err);
      }
      if(!match) {
        return res.status(401).json({
          status: 'fail',
          message: 'Email and/or Password is incorrect.'
        });
      }
      user = user.toObject();
      delete user.password;
      var token = generateToken(user);
      res.status(200).json({
        token: token,
        user: user.email
      })
    });
  });
});

router.get('/logout', function(req, res, next) {

});

// ** Helpers ** //

// generate a token
function generateToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moement().unix(),
    sub: user._id
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

// ensure authenticated
function ensureAuthenticated(req, res, next) {
  // check headers for the presence of an auth object
  if(!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'fail',
      message: 'No Header present or no authorization header.'
    });    
  }
  // decode the token
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);
  var now = moment().unix();
  // make sure it hasn't expired / ensure it's valid
  if(now > payload.exp || payload.iat > now){
    return res.status(401).json({
      status: 'fail',
      message: 'Token is invalid'
    });
  }
  // ensure user is still in the database
  User.findById(payload.sub, function(err, user){
    if(err){
      return next(err);
    }
    if(!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User does not exist'
      });      
    }
    req.user = user;
    next();
  });
};

// ensure admin
function ensureAdmin(req, res, next) {
  // check for the user object
  // ensure admin is true
  if(!(req.user && req.user.admin)) {
    return res.status(401).json({
      status: 'fail',
      message: 'User is not authorized'
    })
    // throw err
  };
  next()
};

module.exports = router;