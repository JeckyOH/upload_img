var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
  if(req.cookies.islogin)
  {
    console.log('cookies:' + req.cookies.islogin);
    req.session.username = req.cookies.islogin;
  }

  if(req.session.username)
  {
    console.log('session:' + req.session.username);
    res.locals.username = req.session.username;
  }

  res.redirect('imageshow?page=1');
});

module.exports = router;
