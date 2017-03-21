var express = require('express'),
    router = express.Router(),
    formidable = require('formidable'),
    fs = require('fs'),
    events = require("events"),
    uuidV1 = require("uuid/v1"),
    Image = require("../modules/images_db.js"),
    TITLE = 'Upload Image',
    UPLOAD_FOLDER = '/images/';

var eventEmitter = new events.EventEmitter();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.cookies.islogin)
  {
    req.session.username = req.cookies.islogin;
  }

  if(req.session.username)
  {
    res.locals.username = req.session.username;
  }
  res.render('imageupload', { title: TITLE });
});

router.post('/', function(req, res) {

  var newImage = new Image();

  //Get username
  if(req.cookies.islogin)
  {
    req.session.username = req.cookies.islogin;
  }

  if(req.session.username)
  {
    res.locals.username = req.session.username;
  }

  if(req.session.username)
  {
    newImage.user_name = req.session.username;
  }

  //use formidable to parse post data
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = 'public' + UPLOAD_FOLDER;
  form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;

  form.parse(req, function(err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.render('imageupload', { title: TITLE });
      return;
    }

    var imageCap = fields.imgCaption;
    if (imageCap.toUpperCase().match("[^0-9A-Z,.!? ]")){
      res.locals.error = 'Invalid Image Caption. Only digitals, characters, comma(,) and period(.) are allowed.';
      res.render('imageupload', { title: TITLE });
      return;
    }
    newImage.caption = fields.imgCaption;

    var extName = '';
    switch (files.fulAvatar.type) {
    case 'image/pjpeg':
      extName = 'jpg';
      break;
    case 'image/jpeg':
      extName = 'jpg';
      break;
    case 'image/png':
      extName = 'png';
      break;
    case 'image/x-png':
      extName = 'png';
      break;
    case 'image/gif':
      extName = 'gif';
      break;
    }

    if(extName.length == 0){
      res.locals.error = 'Invalid format of image. Only support .gif .jpg and .png.';
      res.render('imageupload', { title: TITLE });
      return;
    }

    var fileName = uuidV1() + '.' + extName;
    var newPath = form.uploadDir + fileName;

    //rename this image as an uuid-based name
    fs.renameSync(files.fulAvatar.path, newPath);

    newImage.image_name = fileName;

    //save information of this image into database
    newImage.save(function(err, result, numAffected)
                  {
                    if (err) {
                      res.locals.error = err;
                      res.render('imageupload', { title: TITLE });
                      return;
                    }

                    if(numAffected > 0)
                    {
                      res.locals.success = 'Congratulations! Successfully Upload the Image!' ;
                    }
                    else
                    {
                      res.locals.error = err;
                    }

                    res.render('imageupload', { title: TITLE });
                  });

  });
});

module.exports = router;
