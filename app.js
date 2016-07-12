var express = require('express');
var mailer = require('express-mailer')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
const fit4meMail = 'fit4metest@gmail.com'
const fit4mePW = process.env.password
var app = express();


// express mailer setup
mailer.extend(app, {
  from: fit4meMail,
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user:fit4meMail,
    pass: fit4mePW
  }
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/sendmail', function(req,res){
  app.mailer.send('email', {
    to: fit4meMail,
    subject: 'Test Mailer',

  }, function (err){
    if (err) {
      console.log(err)
      res.send('error sending email')
      return;
    }
    res.send('Email Sent')
  })
})

app.post('/processform', function(req,res){
  console.log('I hear you')
  app.mailer.send('email', {
    to: req.body.emailer,
    subject: 'Test Mailer from'+ req.body.name,

  }, function (err){
    if (err) {
      console.log(err)
      res.send('error sending email')
      return;
    }
    res.send('Email Sent')
  })
})

app.post('/processFormA1', function(req,res){
  console.log('ProcessFormA1 has Run')
  app.mailer.send('formMailer', {
    to: fit4meMail,
    subject: 'testformA1',
  }, function(err){
    if (err) {
      console.log(err)
      res.send('error sending email')
      return
    }
    res.send('Email Sent')
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
