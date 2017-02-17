var express = require('express'),
    router = express.Router(),
    User = require('../modules/user_db.js'),
    crypto = require('crypto'),
    TITLE_LOGIN = 'Sign IM';

router.get('/', function(req, res) {
    res.render('login',{title:TITLE_LOGIN});
});

router.post('/', function(req, res) {
    var userName = req.body['txtUserName'],
        userPwd = req.body['txtUserPwd'],
        isRem = req.body['chbRem'],
        md5 = crypto.createHash('md5');

    User.getUserByUserName(userName, function (err, results) {

        if(results == '')
        {
            res.locals.error = 'Username does not exist!';
             res.render('login',{title:TITLE_LOGIN});
             return;
        }

         userPwd = md5.update(userPwd).digest('hex');
         if(results[0].username != userName || results[0].userpass != userPwd)
         {
             res.locals.error = 'Invalid username or password!';
             res.render('login',{title:TITLE_LOGIN});
             console.log(1);
             return;
         }
         else
         {
             if(isRem)
             {
                res.cookie('islogin', userName, { maxAge: 60000 });
             }

             res.locals.username = userName;
             req.session.username = res.locals.username;
             console.log(req.session.username);
             res.redirect('/');
             return;
         }
    });
});

module.exports = router;
