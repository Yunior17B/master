const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
// Load User model
const User = require('../models/UserModel').User;
const { forwardAuthenticated } = require('../config/auth');



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
  
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(function(user, done) {
      done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
      User.findOne(id, function(err, user) {
          done(null, user);
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
passport.use('login',new LocalStrategy({
  emailField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req,email, password, done) {
      User.findOne({ 'email': email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
          return done(null, false, req.flash('loginMessage','Incorrect username.' ));
      }
      if (user.password != password ) {
          return done(null, false,  req.flash('loginMessage','Incorrect password !' ));
      }
      return done(null, user);
      });
  }
));
   
// Login
router.post('/login',  function(req, res, next ){
  passport.authenticate('login', function(err, user, info) {
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
  passport.authenticate('login', function(err, user, info) {
    res.redirect('/client');
    req.flash('success_msg', 'You are log in'+ user);
  },
  {
  failureRedirect: '/users/login',
  successRedirect: '/client',
  failureFlash: true
})
  (req, res, next);   
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;