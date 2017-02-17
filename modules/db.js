/**
   I did not specify port and use default port.
   */
var mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost/imageUploadApp';


mongoose.connect(DB_URL);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});


mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
