var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
var User = require('../models/user');
var util = require('util');

router.get('/signup',function(req, res){
  console.log("redirected to signup");
  //res.sendFile(path.join(__dirname+'/views/signup.html'));
  res.render('signup', {title: "Sign up", condition: false});
});


router.post('/signup', function(req, res, next){
  console.log("in signup submit");
  console.log(req.body);
  req.checkBody('username', 'Enter a valid Name!').notEmpty().isLength({min: 3});
  req.checkBody('email', 'Invalid email Address!').isEmail();
  req.checkBody('password', 'Incorrect password!').isLength({min: 6}).equals(req.body.confirmPassword);
  

  var errors = req.validationErrors();
  if(errors){
    console.log("Errors in signup");
    var error_msg = "<div class='alert alert-danger'>"+errors[0].msg+"<br></div>";
    console.log("error msg:"+error_msg);
    req.session.errors = errors;
    req.session.success = false;
    var response = {status : 406, msg : error_msg };
    res.send(JSON.stringify(response));
  }
  else{
    console.log("signup validation successful");
    req.session.success = true;
    
    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    
    console.log("newUser:"+JSON.stringify(newUser));
    User.createUser(newUser, req, res, function( res, response){
      console.log("in callback: response = "+JSON.stringify(response));
      res.send(JSON.stringify(response));
    });
  }

});


router.get('/login',function(req, res){
  console.log("redirected to login");
  //res.sendFile(path.join(__dirname+"/views/login.html"));
  res.render('login', { title: "Log in", condition: false});
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    //process.nextTick(function () {
      User.getUserByName(username, function(err, user){
        if(err) throw err;
        if(!user){
          return done(null, false, {message: 'Unknown user'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
          if(err)throw err;
          if(isMatch){
            return  done(null, user);
          }
          else return done(null, false, {message: 'Incorrect password'});
        });
      }  
    )
  //})
}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) {
      //req.flash('error_msg', 'Login failed!'); 
      var response = {status : 406, msg : "<div class='alert alert-danger'>Login failed!<br></div>" };
      res.send(JSON.stringify(response));
      //return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      //Redirect if it succeeds
      console.log("logged in user "+req.session.passport.user);
      var response = {status : 200, msg : "Login successful!", user: req.session.passport.user};
      res.send(JSON.stringify(response));
      //return res.redirect('/users/homepage');//'/users/' + user.username
    });
  })(req, res, next);
});


router.get('/logout', function(req, res){
  console.log("in logout");
  req.logout();
  //res.send(JSON.stringify(response));
  res.redirect('/users/login');
});


router.get('/homepage', function(req, res){
  console.log("in homepage get()");
  if(req.isAuthenticated()){
    console.log("redirected to homepage");
    //res.sendFile(path.join(__dirname+"/views/homepage.html"));
    
    res.render('homepage', { title: "Homepage", condition: false});
  }
  else{
    //req.flash('error_msg', "You are not logged in");
    console.log("not logged in");
    //var response = {status : 406, msg : "<div class='alert alert-danger'>You are not logged in!<br></div>" };
    //document.getElementById('error_msg').innerHTML = response.msg;
    res.redirect('/users/login');
  }
  
});


module.exports = router;