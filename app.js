var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

/**
   These are midwares I use.
 */
var routes = require('./routes/index');
var register = require("./routes/register");
var login = require("./routes/login");
var logout = require("./routes/logout");
var imageupload = require("./routes/imageupload");
var imageshow = require("./routes/imageshow");
var myimageshow = require("./routes/myimageshow");
var imagetransfer = require("./routes/imagetransfer");
var myimageremove = require("./routes/myimageremove");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Wilson'));
app.use(session({secret: 'Wilson'}));
app.use(express.static(path.join(__dirname, 'public')));

/*
  Load midwares.
 */
app.use('/', routes);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/imageupload', imageupload);
app.use('/imageshow', imageshow);
app.use('/myimageshow', myimageshow);
app.use('/public/images/*', imagetransfer);
app.use('/myimageremove', myimageremove);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080, function()
           {
             console.log("Server start!");
           });

var https = require('https')
    ,fs = require("fs");

var options = {
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./file.crt')
};

https.createServer(options, app).listen(3011, function () {
    console.log('Https server listening on port ' + 3011);
});

module.exports = app;
