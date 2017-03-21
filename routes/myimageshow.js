var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    Image = require("../modules/images_db.js"),
    TITLE = 'Show My Own Images',
    IMAGE_FOLDER = 'public/images/',
    IMAGE_NUM_PER_PAGE  = 10;

/* GET home page. */
router.get('/', function(req, res){

  var req_username = "";

  if(req.cookies.islogin)
  {
    req.session.username = req.cookies.islogin;
    req_username = req.session.username;
  }

  if(req.session.username)
  {
    res.locals.username = req.session.username;
  }

  var page = parseInt(req.query.page);

  if(typeof page !== 'number' || !(page > 0))
  {
    console.log("Invalid Page Number!");
    res.locals.error = "Invalid Page Number!";
    res.render('imageshow', { title: TITLE });
    return;
  }

  Image.getImageNumByUsername(req_username, function (err, result)
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
                        res.render('myimageshow', { title: TITLE, images:images });
                        return;
                      }
                      res.locals.total_page = Math.ceil(result / 10);
                      res.locals.current_page = page;

                      Image.getNImageByUsername(req.session.username,
                                                (page - 1)*IMAGE_NUM_PER_PAGE,
                                                IMAGE_NUM_PER_PAGE,
                                                function(err, results)
                                      {
                                        if(err)
                                        {
                                          console.log("Error:" + err);
                                          res.locals.error = err;
                                          res.render('myimageshow', { title: TITLE, images:images });
                                          return;
                                        }
                                        var images = [];
                                        for(var index in results)
                                        {
                                          var path = IMAGE_FOLDER + results[index].image_name;
                                          console.log("image path:" + path);
                                          console.log("image caption:" + results[index].caption);
                                          images.push({path:path, caption:results[index].caption, upload_time:results[index].upload_time});
                                        }
                                        console.log("Ready to routes to imageshow. images:" + images.length);
                                        res.render('myimageshow', {title: TITLE, images: images});
                                      });
                    });

});

router.post('/', function(req, res) {
  res.render('myimageshow', { title: TITLE });
});

module.exports = router;
