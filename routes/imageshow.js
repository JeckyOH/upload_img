var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    Image = require("../modules/images_db.js"),
    TITLE = 'Show Images',
    IMAGE_FOLDER = 'public/images/',
    IMAGE_NUM_PER_PAGE  = 10;

/* GET home page. */
router.get('/', function(req, res){

  if(req.cookies.islogin)
  {
    req.session.username = req.cookies.islogin;
  }

  if(req.session.username)
  {
    res.locals.username = req.session.username;
  }

  //get page number from url
  var page = parseInt(req.query.page);

  if(typeof page !== 'number' || !(page > 0))
  {
    console.log("Invalid Page Number!");
    res.locals.error = "Invalid Page Number!";
    res.render('imageshow', { title: TITLE });
    return;
  }

  //get total number of images in order to construct pagination
  Image.getImageNum(function (err, result)
                    {
                      var images = [];
                      if(!(result > 0))
                      {
                        err = "Error in finding image number.";
                      }
                      if(err)
                      {
                        console.log("Error:" + err);
                        res.locals.error = err;
                        res.render('imageshow', { title: TITLE, images:images });
                        return;
                      }
                      res.locals.total_page = Math.ceil(result / 10);
                      res.locals.current_page = page;

                      //get images in the specified page
                      Image.getNImage((page - 1)*IMAGE_NUM_PER_PAGE, IMAGE_NUM_PER_PAGE, function(err, results)
                                      {
                                        if(err)
                                        {
                                          console.log("Error:" + err);
                                          res.locals.error = err;
                                          res.render('imageshow', { title: TITLE, images:images });
                                          return;
                                        }

                                        for(var index in results)
                                        {
                                          var path = IMAGE_FOLDER + results[index].image_name;
                                          console.log("image path:" + path);
                                          //push url, caption and upload time to an array in order to use them in .ejs view model.
                                          images.push({path:path, caption:results[index].caption, upload_time:results[index].upload_time});
                                        }
                                        console.log("Ready to routes to imageshow. images:" + images.length);
                                        res.render('imageshow', {title: TITLE, images: images});
                                      });
                    });

});

router.post('/', function(req, res) {
  res.render('index', { title: TITLE });
});

module.exports = router;
