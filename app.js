//-----------------NODES-------------------------
var express = require('express');
var mailer = require('express-mailer')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
const fit4meMail = 'fit4metest@gmail.com'
const fit4mePW = process.env.password
var app = express();


//------------ express mailer setup---------------------
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

//-------------- view engine setup------------------
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

function getFormFileName(programID){
  return 'form'+programID
}

//============================================
// List All Programs==========================
//============================================
app.get('/programs', function(req,res){
  fs.readFile('./data.json', 'utf8', function (err,data){
    var list = JSON.parse(data)
    console.log(list)
    res.render('programlist',{programs:list})
  })
})
//===========================================
// Create New Program Form===================
//===========================================
app.get('/programs/new', function (req,res){
  res.render('newprogram')
})
app.post('/processNewProgram', function(req,res){
  var newProg = {id:req.body.programID,name:req.body.programName}
  fs.readFile('./data.json', 'utf8', function (err,data){
    var allPrograms = JSON.parse(data)
    allPrograms.push(newProg)
    fs.writeFile('./data.json', JSON.stringify(allPrograms), function(err) {
      res.redirect('/programs')
    })
  })
})
//===========================================
// Edit Existing Program Form================
//===========================================
app.get('/programs/:programID', function (req,res){
  fs.readFile('./data.json', 'utf8', function (err,data){
    var allPrograms = JSON.parse(data)
    var program = allPrograms.find(function(p){
      return p.id===req.params.programID
    })
    res.render('editProgram',program)
  })
})
app.post('/updateProgram/:programID', function(req,res){
  fs.readFile('./data.json', 'utf8', function (err,data){
    var allPrograms = JSON.parse(data)
    var program = allPrograms.find(function(p){
      return p.id===req.params.programID
    })
    program.name=req.body.programName
    fs.writeFile('./data.json', JSON.stringify(allPrograms), function(err) {
      res.redirect('/programs')
    })
  })
})
//===========================================
// Remove Existing Program Form==============
//===========================================

app.get('/removeProgram/:programID',function(req,res){
  fs.readFile('./data.json', 'utf8', function(err,data){
    var allPrograms = JSON.parse(data)
    var program = allPrograms.find(function(p){
      return p.id===req.params.programID
    })
    res.render('removeProgram',program)
  })
})
app.post('/deleteProgram/:programID', function(req,res){
  fs.readFile('./data.json', 'utf8', function (err,data){
    var allPrograms = JSON.parse(data)
    var program = allPrograms.find(function(p){
      return p.id===req.params.programID
    })
    allPrograms = allPrograms.filter(function(obj) {
      return program.id.indexOf(obj.id) === -1
    })
    fs.writeFile('./data.json', JSON.stringify(allPrograms), function(err) {
      res.redirect('/programs')
    })    

  })
})
  


//=========================================
// User Program Log Form to Submit=========
//=========================================
app.get('/log/:programID', function(req,res){
  console.log(req.params.programID)
  var form='form'+req.params.programID
  res.render(form,{})
})
//==========================================
// Send Email Protocol form PorgramA1=======
//==========================================
app.post('/processFormA1', function(req,res){
  console.log('ProcessFormA1 has Run')
  console.log(req.body)
  app.mailer.send('formMailer', {
    to: fit4meMail,
    subject: 'testformA1',
    userEmail: req.body.emailInput,
    userName: req.body.nameInput,
    userDate: req.body.startDateInput,
    userEndDate: req.body.endDateInput,
    userComment: req.body.userComment,
    //-----------------Day 1-------------------
    w1d1UBC: checkOn(req.body.w1d1UBCheck), w1d1LBC: checkOn(req.body.w1d1LBCheck),
    w2d1UBC: checkOn(req.body.w2d1UBCheck), w2d1LBC: checkOn(req.body.w2d1LBCheck),
    w3d1UBC: checkOn(req.body.w3d1UBCheck), w3d1LBC: checkOn(req.body.w3d1LBCheck),
    w4d1UBC: checkOn(req.body.w4d1UBCheck), w4d1LBC: checkOn(req.body.w4d1LBCheck),
    //-----------------Day 2-------------------
    w1d2AL: checkAerobic(req.body.w1d2AL, req.body.w1d2AE),
    w2d2AL: checkAerobic(req.body.w2d2AL, req.body.w2d2AE),
    w3d2AL: checkAerobic(req.body.w3d2AL, req.body.w3d2AE),
    w4d2AL: checkAerobic(req.body.w4d2AL, req.body.w4d2AE),
    //-----------------Day 3-------------------
    w1d3Ab: checkOn(req.body.w1d3CCheck),
    w2d3Ab: checkOn(req.body.w2d3CCheck), 
    w3d3Ab: checkOn(req.body.w3d3CCheck), 
    w4d3Ab: checkOn(req.body.w4d3CCheck),  
    //-----------------Day 4 Rest--------------
    //-----------------Day 5-------------------
    w1d5UBC: checkOn(req.body.w1d5UBCheck), w1d5LBC: checkOn(req.body.w1d5LBCheck),
    w2d5UBC: checkOn(req.body.w2d5UBCheck), w2d5LBC: checkOn(req.body.w2d5LBCheck),
    w3d5UBC: checkOn(req.body.w3d5UBCheck), w3d5LBC: checkOn(req.body.w3d5LBCheck),
    w4d5UBC: checkOn(req.body.w4d5UBCheck), w4d5LBC: checkOn(req.body.w4d5LBCheck),
    //-----------------Day 6-------------------
    w1d6AL: checkAerobic(req.body.w1d6AL, req.body.w1d6AE),
    w2d6AL: checkAerobic(req.body.w2d6AL, req.body.w2d6AE),
    w3d6AL: checkAerobic(req.body.w3d6AL, req.body.w3d6AE),
    w4d6AL: checkAerobic(req.body.w4d6AL, req.body.w4d6AE),
    //-----------------Day 7 Rest--------------
    

  }, function(err){
    if (err) {
      console.log(err)
      res.send('error sending email')
      return
    }
    res.send('Email Sent')
  })
})
//=========================================
// Email Render Tests======================
//=========================================
app.get('/test1', function(req, res){
  res.render('formMailer', {
    to: fit4meMail,
    subject: 'testEmail',
    userEmail: 'something@somewhere.com',
    userName: 'Susan Somebody',
    userDate: "2016-07-18",
    userEndDate: "2016-08-18",
    userComment: "Had trouble following exercise 3 on day 5. Feel that I am ready to progress in my aerobic activity. This is a really long run on string to test wrapping of the text. Had trouble following exercise 3 on day 5. Feel that I am ready to progress in my aerobic activity. This is a really long run on string. ",
    //-----------------Day 1-------------------
    w1d1UBC: checkOn('on') , w1d1LBC: checkOn('on'),
    w2d1UBC: checkOn('on'), w2d1LBC: checkOn('on'),
    w3d1UBC: checkOn('on'), w3d1LBC: checkOn('on'),
    w4d1UBC: checkOn('on'), w4d1LBC: checkOn('on'),
    //-----------------Day 2-------------------
    w1d2AL: 5 + 'min', w1d2AE: 'skating',
    w2d2AL: 10 + 'min', w2d2AE: 'outdoor running',
    w3d2AL: 15 + 'min', w3d2AE: 'treadmill running',
    w4d2AL: 20 + 'min', w4d2AE: 'outdoor biking',
    //-----------------Day 3-------------------
    w1d3Ab: checkOn('on'),
    w2d3Ab: checkOn('on'), 
    w3d3Ab: checkOn('on'), 
    w4d3Ab: checkOn('on'),  
    //-----------------Day 4 Rest--------------
    //-----------------Day 5-------------------
    w1d5UBC: checkOn('on'), w1d5LBC: checkOn(),
    w2d5UBC: checkOn('on'), w2d5LBC: checkOn(undefined),
    w3d5UBC: checkOn('on'), w3d5LBC: checkOn('on'),
    w4d5UBC: checkOn('on'), w4d5LBC: checkOn('on'),
    //-----------------Day 6-------------------
    w1d6AL: checkAerobic(10, 'hockey'), 
    w2d6AL: checkAerobic(undefined,undefined),
    w3d6AL: checkAerobic(60, undefined),
    w4d6AL: checkAerobic(undefined, 'hockey'),
    //-----------------Day 7 Rest--------------
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


// Check Log Form values ===================
function checkOn(checkValue){
  if (checkValue==='on'){
    return 'Completed'
  }
  return 'Incomplete'
}

function checkAerobic(time, activity){
  if(time >=0 && activity !== undefined) {
    return time + ' min '+ activity
  }
  if(time >=0 && activity === undefined) {
    return time + 'min: Not stated'
  }
  if(time === undefined && activity !== undefined) {
    return 'Not Stated: ' + activity 
  }
  return 'Incomplete'
}

