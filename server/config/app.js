/*
File:       app.js
Name:       Ziyan Liu
Student Id: 301133339
Date:       2022-10-01
*/

// installed 3rd party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors=require('cors');

//modules for authentication
let session=require('express-session');
let passport=require('passport');

let passportJWT=require('passport-jwt');
let JWTStrategy=passportJWT.Strategy;
let ExtractJWT=passportJWT.ExtractJwt;

let passportLocal=require('passport-local');
let localStrategy=passportLocal.Strategy;
let flash=require('connect-flash');

//database setup
let mongoose=require('mongoose');
let DB=require('./db');

//point mongoose to the DB URI
mongoose.connect(DB.URI,{
  useNewUrlParser:true, useUnifiedTopology:true
});

//creat an event to see the mongo database
let mongoDB=mongoose.connection;

mongoDB.on('error',console.error.bind(console,'Connection Error:'));//send error to the console
mongoDB.once('open',()=>{
  console.log("Database Connected");
});
//creat event inline handler;Guranetee if we have connection in mongo database, we are going to see it in the console


//"./"means in the same folders
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let contactsRouter = require('../routes/contact');
const { support } = require('jquery');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

//setup express session
app.use(session({
  secret:"SomeScret",
  saveUninitialized:false,
  resave:false
}));

//initialize flash
//maintian the error message, put inside of local storage
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport user configuration


//create a User Model Instance
let userModel=require('../models/user');
let User=userModel.User;

// implement a User Authentication Strategy
passport.use(User.createStrategy());

//serialize and deserilize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let jwtOptions={};
jwtOptions.jwtFromRequest=ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey=DB.Secret;

let Strategy= new JWTStrategy(jwtOptions,(jwt_payload,done)=>{
  User.findById(jwt_payload)
  .then(user=>{
    return done(null,user);
  })
  .catch(err=>{
    return done(err,false);
  });
});

passport.use(Strategy);

//routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact-list',contactsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{ title: 'Error'});
});

module.exports = app;
