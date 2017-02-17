var mongoose = require('./db');

var Schema = mongoose.Schema;


/*
  imageinfo collection has 4 propoties:
  caption of the image(maybe blank)
  username of the user who submitted the image
  uploading time of this image
  name of this image---I use uuid to give a name.
  */
var imageSchema = new Schema(
  {
    caption: {type: String},
    user_name: {type: String},
    upload_time: {type: Date, default: Date.now},
    image_name: {type: String}
  }
);

var imageinfo = mongoose.model('imageinfo', imageSchema);

function Image(){
  this.caption = "";
  this.user_name = "";
  this.image_name = "";
};

module.exports = Image;

/*
  Save a new document to imageinfo collection.
  I mean, there is a new image has been uploaded.
  */
Image.prototype.save =
    function save(callback){
      var image = new imageinfo(
        {
          caption: this.caption,
          user_name: this.user_name,
          image_name: this.image_name
        });

      image.save(function (err, res, numAffected)
                {
                  if (err)
                  {
                    console.log("Error:" + err);
                  }
                  else {
                    console.log("invoked[saveimage]");
                    callback(err,res, numAffected);
                  }

                });
    };


/*
  Get the total number of images.
  This will be used to construct pagination.
  */
Image.getImageNum = function getImageNum(callback)
{
  imageinfo.count({}, function(err, res)
                  {
                    if(err)
                    {
                      console.log("Error: " + err);
                    }
                    else
                    {
                      console.log("invoked[getImageNum]");
                      callback(err,res);
                    }
                  });
};


/*
  Get the number of images belonging to a user.
  This will be used to construct pagination.
  */
Image.getImageNumByUsername = function getImageNumByUsername(username, callback)
{
  var wherestr = {user_name: username};
  imageinfo.count(wherestr, function(err, res)
                  {
                    if(err)
                    {
                      console.log("Error: " + err);
                    }
                    else
                    {
                      console.log("invoked[getImageNum]");
                      callback(err,res);
                    }
                  });
};


/*
  Get images in the specified page.
  offset is (page-1)*10
  number is 10
  */
Image.getNImage = function getNImage(offset, number, callback)
{
  imageinfo.find({},
                 ['image_name', 'caption', 'upload_time'],
                 {
                   sort: {'upload_time': -1},
                   skip: offset,
                   limit: number
                },
                 function(err, res)
                  {
                    if(err)
                    {
                      console.log("Error: " + err);
                    }
                    else
                    {
                      console.log("invoked[getNImage]");
                      callback(err,res);
                    }
                  });
};

/*
  get images belonging to a user in the specified page.
  */
Image.getNImageByUsername = function getNImageByUsername(username, offset, number, callback) {

  imageinfo.find({'user_name' : username},
                 ['image_name', 'caption', 'upload_time'],
                 {
                   sort: {'upload_time': -1},
                   skip: offset,
                   limit: number
                 },
                 function(err, res)
                  {
                    if(err)
                    {
                      console.log("Error: " + err);
                    }
                    else
                    {
                      console.log("invoked[getNImageByUsername]");
                      callback(err,res);
                    }
                  });
};

/*
  remove image information from database
  */
Image.removeImageByName = function removeImageByName(imageName, callback)
{
  var wherestr = {image_name:imageName};
  imageinfo.remove(wherestr, function(err)
                   {
                     if(err)
                     {
                       console.log("Error in remove image from database." + err);
                     }
                     else
                     {
                       console.log("invoked[removeImageByName]");
                       callback(err);
                     }
                   });
};
