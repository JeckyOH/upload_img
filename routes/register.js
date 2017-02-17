var express = require('express'),
    router = express.Router(),
    User = require('../modules/user_db.js'),
    crypto = require('crypto'),
    TITLE_REG = 'Sign Up';

router.get('/', function(req, res) {
  res.render('register',{title:TITLE_REG});
});

router.post('/', function(req, res) {
  var userName = req.body['txtUserName'],
      userPwd = req.body['txtUserPwd'],
      userRePwd = req.body['txtUserRePwd'],
      md5 = crypto.createHash('md5');

      userPwd = md5.update(userPwd).digest('hex');

  var newUser = new User({
      username: userName,
      userpass: userPwd
  });

  //check if there exist the specified username
  User.getUserNumByName(newUser.username, function (err, results) {

      if (results != null && results > 0) {
          err = 'Username Already Exist!';
      }

      if (err) {
          res.locals.error = err;
          res.render('register', { title: TITLE_REG });
          return;
      }

    //save this user into database
    newUser.save(function (err,result, numAffected) {
          if (err) {
              res.locals.error = err;
              res.render('register', { title: TITLE_REG });
              return;
          }

          if(numAffected > 0)
          {
              res.locals.success = 'Congratulations! You have successfully sign up. Please click:   <a class="btn btn-link" href="/login" role="button"> Sign In </a> to log in your account.' ;
          }
          else
          {
              res.locals.error = err;
          }

          res.render('register', { title: TITLE_REG });
          });
    });
});

module.exports = router;
