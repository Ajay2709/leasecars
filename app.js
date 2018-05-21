var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var session = require('express-session');
var validator = require('express-validator');
var passport = require('passport'); 
var LocalStrategy = require("passport-local").Strategy;
var util = require('util');
var mongo  = require('mongodb');
var mongoose = require('mongoose');


var User = require('./models/user');
var Car = require('./models/car');
var Booking = require('./models/booking');
mongoose.connect('mongodb://ajayTest:ajay2112@ds129540.mlab.com:29540/car_leasing_system');
var db = mongoose.connection;


var routes = require('./routes/index.js');


var path = require("path");


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(validator());
app.use(session({secret: 'secret key', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


app.use(validator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(), 
    formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

/*Error no. 1*/
//app.use('/', routes);
//app.use(app.router);
//router.initialize(app);

app.set('port', (process.env.PORT || 9090));


var server = app.listen(app.get('port'), function () {
  console.log("App listening at http://"+app.get('port'));
});


 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function(req, res){
  console.log("in get /");
  res.sendFile(path.join(__dirname+'/views/index.html'));
  //res.redirect('/signup');
})

app.get('/signup',function(req, res){
  console.log("redirected to signup");
  res.sendFile(path.join(__dirname+'/views/signup.html'));
  //res.render('signup');
});


app.post('/signup', function(req, res, next){
  console.log("in signup submit");
  console.log(req.body);
  req.checkBody('username', 'Enter a valid Name!').notEmpty().isLength({min: 3});
  req.checkBody('email', 'Invalid email Address!').isEmail();
  req.checkBody('password', 'Incorrect password!').isLength({min: 6}).equals(req.body.confirmPassword);
  

  var errors = req.validationErrors();
  if(errors){
    console.log("Errors in signup");
    var error_msg = errors[0].msg;
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


app.get('/login',function(req, res){
  console.log("redirected to login");
  res.sendFile(path.join(__dirname+"/views/login.html"));
  //res.render('login', { title: "Log in", condition: false}); /*Use when using view engines otherwise throws error*/
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
      })
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


app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) {
      //req.flash('error_msg', 'Login failed!'); 
      var response = {status : 406, msg : "Incorrect Username/password!"};
      res.send(JSON.stringify(response));
      //return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      //Redirect if it succeeds
      console.log("loggd in user "+req.session.passport.user);
      var response = {status : 200, msg : "Login successful!", user: req.session.passport.user};
      res.send(JSON.stringify(response));
      //return res.redirect('/users/homepage');//'/users/' + user.username
    });
  })(req, res, next);
});


app.get('/logout', function(req, res){
  console.log("in logout");
  req.logout();
  //res.send(JSON.stringify(response));
  res.redirect('login');
});


app.get('/homepage', function(req, res){
  console.log("in homepage get()");
  if(req.isAuthenticated()){
    console.log("redirected to homepage");
    res.sendFile(path.join(__dirname+"/views/homepage.html"));
    
    //res.render('homepage', );
  }
  else{
    //req.flash('error_msg', "You are not logged in");
    console.log("not logged in");
    //var response = {status : 406, msg : "<div class='alert alert-danger'>You are not logged in!<br></div>" };
    //document.getElementById('error_msg').innerHTML = response.msg;
    res.redirect('/login');
  }
  
});


app.get('/adminlogin',function(req, res){
  console.log("redirected to admin login page");
  res.sendFile(path.join(__dirname+'/views/signup.html'));
  //res.render('signup');
});


app.get('/adminHome', function(req, res){
  console.log("Admin homepage");
  res.sendFile(path.join(__dirname+"/views/adminhomepage.html"));
});



app.post('/addcar', function(req, res, next){
  console.log("addcar POST");
  var newCar = {
    carname: req.body.carname,
    model: req.body.model,
    fare: req.body.fare,
    count: req.body.count,
    available: req.body.available
  };
  console.log(newCar);
  Car.addCar(req, res, newCar, function( res, result){
      console.log("in callback: response = "+JSON.stringify(result));
      res.send(JSON.stringify(result));
    });

});


app.get('/fetchcars', function(req, res){
  console.log("in fetchcars GET");
  Car.getCars(req, res, function(res, result){
    res.send(JSON.stringify(result));
  });
});


app.post('/bookcar', function(req, res){
  console.log("in book car GET");
  //console.log('req:'+util.inspect(req));
  var newBooking = {
    carname: req.body.carname,
    user: { id:req.user._id, username: req.user.username},
    location:req.body.location,
    hiredate: req.body.hiredate,
    returndate: req.body.returndate
  };
  console.log(newBooking);
  Booking.bookCar(req, res, newBooking, function(res, result){
    res.send(JSON.stringify(result));
  });
});

app.get('/returncar', function(req, res){
  console.log("in return car get");
  Booking.returnCar(req, res, function(res, result){
    res.send(JSON.stringify(result));
  })
});