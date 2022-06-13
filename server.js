/***********************************************************************
**********
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: ____Pavneet Kaur__________________ Student ID: __128287216____________ Date: 
__________6/12/2022______
*
* Online (Heroku) Link: 
__https://afternoon-cove-55309.herokuapp.com/___________________________________________________
*
************************************************************************
********/
var express = require("express");
var app = express();
var path = require("path");
var blog = require("./blog-service.js");
const multer = require("multer");
 const cloudinary = require('cloudinary').v2
 const streamifier = require('streamifier')
//cloudinary configuration
cloudinary.config({
 cloud_name: 'pavneet07',
 api_key: '619155739842222',
 api_secret: 'FrUbofr_QvEiqDzdB2as_N4bHss',
 secure: true
});
//
const upload = multer();

app.use(express.static("public"));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});
app.get("/blog", function (req, res) {
  blog
    .getPublishedPosts()
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      res.json({ message: err });
    });
});
app.get("/posts", function (req, res) {
  //for the route /posts?category=value
  if (req.query.category) {
    blog. getPostsByCategory(req.query.category).then((data) => {
      res.json(data);
    }).catch(function(err){
      res.json({ message: err });
    })
  }
  // for the route /posts?minDate=value
   else if (req.query.minDate) {
    blog. getPostsByMinDate(req.query.minDate).then((data) => {
      res.json(data);
    }).catch(function(err){
      res.json({ message: err });
    })
  }
    //for /posts main route
  else {
    blog
      .getAllPosts()
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      res.json({ message: err });
    });
  }
});

//for "/post/value
app.get('/post/:id',(req,res)=>{

   blog.getPostById(req.params.id).then((data)=>{

    res.json(data);
   }) .catch(function (err) {
      res.json({ message: err });
    });


  });
app.get("/categories", function (req, res) {
  blog
    .getCategories()
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      res.json({ message: err });
    });
});
app.get("/posts/add", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});
app.post('/posts/add', upload.single("featureImage"), (req, res) => {
  
  let streamUpload = (req) => {
 return new Promise((resolve, reject) => {
 let stream = cloudinary.uploader.upload_stream(
 (error, result) => {
 if (result) {
 resolve(result);
 } else {
 reject(error);
 }
 }
 );
 streamifier.createReadStream(req.file.buffer).pipe(stream);
 });
};
async function upload(req) {
 let result = await streamUpload(req);
 console.log(result);
 return result;
}
upload(req).then((uploaded)=> {
  req.body.featureImage = uploaded.url;
  blog.addPost(req.body).then(()=>{
        res.redirect('/posts');
    }).catch((data)=>{res.send(data);})
 

});

})
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/error.html"));
});
var PORT = process.env.PORT || 8080;
blog
  .initialize().then((msg) => {
    app.listen(PORT, ()=> {
        console.log(`Express http server is listening  on  ${PORT}`);
    })
}).catch((err)=> {
    console.log(err);
})
