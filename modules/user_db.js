var mongoose = require('./db');

var Schema = mongoose.Schema;

/**
   userinfo collection has 3 propoties:
   username userpass and logindate.
   */
var userSchema = new Schema(
  {
    username: {type: String},
    userpass: {type: String},
    logindate: {type: Date}
  }
);

var userinfo = mongoose.model('userinfo', userSchema);

function User(user){
  this.username = user.username;
  this.userpass = user.userpass;
  this.logindate = new Date();
};

module.exports = User;

/*
  @brief Save new document to userinfo collection--- A new account
  */
User.prototype.save =
    function save(callback){
      var user = new userinfo(
        {
          username: this.username,
          userpass: this.userpass,
          logindate: this.logindate
        });

      user.save(function (err, res, numAffected)
                {
                  if (err)
                  {
                    console.log("Error:" + err);
                  }
                  else {
                    console.log("invoked[saveuser]");
                    callback(err,res, numAffected);
                  }

                });
    };

/*
  @brief Get the number of collection of a specified username
  */
User.getUserNumByName = function getUserNumByName(username, callback) {

  var wherestr = {'username' : username};

  userinfo.count(wherestr, function(err, res)
                  {
                    if(err)
                    {
                      console.log("Error: " + err);
                    }
                    else
                    {
                      console.log("invoked[getUserNumByName]");
                      callback(err,res);
                    }
                  });
};

/*
  Get the document of a specified username
  */
User.getUserByUserName = function getUserByUserName(username, callback) {

  var wherestr = {'username' : username};

  userinfo.find(wherestr, function(err, res)
                 {
                   if(err)
                   {
                     console.log("Error: " + err);
                   }
                   else
                   {
                     console.log("invoked[getUserByUserName]");
                     callback(err,res);
                   }
                 });
};
