var express = require('express'),
    router = express.Router(),
    fs = require('fs');

router.get('/', function(req, res){

  res.sendFile(req.originalUrl,
               {
                 root:__dirname + "/../",
                 dotfiles: 'deny'
               },
               function(err){
                 if(err)
                 {
                   console.log("error in sendFile:" + err);
                   res.status(500).send({error:err});
                 }
               });

});

module.exports = router;
