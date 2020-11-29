const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
// Load User model
const User = require('../models/UserModel').User;
const { forwardAuthenticated } = require('../config/auth');
const db = require('./db');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login.ejs'));
router.get('/login/client', forwardAuthenticated, (req, res) => res.render('LoginClient.ejs'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

    // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  

  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      role
    });
  } else {  
    User.findOne({ email: email }).exec().then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          role
        });
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      } else {
        const newUser = new User({
          email,
          password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            console.log(hash);
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//Local Strategy use to authorizated user in services 
passport.use(new LocalStrategy({
  usernameField: 'email',    
  passwordField: 'password'
},
  function(email, password, done) {
    console.log('local strategy called with: %s', email);
    // User.find(email, function (err, user){
    //   if (err) {
    //     return done(err);
    // }
    // if (!user) {
    //     return done(null, false, { message: "Incorrect username." });
    // }
    // if (password !== user.password) {
    //     return done(null, false, { message: "Incorrect password." })
    // }


    // })
       // if(!user.verifyPassword(password)){
    //   return done(null, false, { message: 'Incorrect password.' });
    // } 
    return done(null, {username: email, password: password});
  }));

// Login
router.post('/login',  function(req, res, next ){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.json( { message: info.message }) }
    res.redirect('/');
    req.flash('success_msg', 'You are log in'+ user);
  },
  {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureFlash: true
})
  (req, res, next);   
});

router.post('/login/client', function(req, res, next ){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.json( { message: info.message }) }
    res.redirect('/client');
  },
  {failureRedirect: '/users/login',
  successRedirect: '/client',
  failureFlash: true})
  (req, res, next);   
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;