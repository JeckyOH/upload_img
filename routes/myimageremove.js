var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Image = require("../modules/images_db.js"),
    UPLOAD_FOLDER = '/images/';

router.post('/', function(req, res) {
  if(req.cookies.islogin)
  {
    req.session.username = req.cookies.islogin;
  }

  if(req.session.username)
  {
    res.locals.username = req.session.username;
  }
  res.render('myimageshow', { title: TITLE });
});

router.get('/', function(req, res) {

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

  var imageName = req.query.name;

  fs.unlink(imageName, function(err)
            {
              if(err)
              {
                console.log("Error in removing image." + err);
                res.redirect("/myimageshow?page=1");
                return;
              }
              var imageBaseName = path.basename(imageName);
              Image.removeImageByName(imageBaseName, function(err)
                                      {
                                          res.redirect("/myimageshow?page=1");
                                      });

            });

});

module.exports = router;
