/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Pavneet Kaur____________________ Student ID: _128287216_____________ Date: __7/8/2022______________
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 
var express = require("express");
const exhbs = require('express-handlebars')
var app = express();
var path = require("path");
var blog = require("./blog-service.js");
const multer = require("multer");
 const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
  const stripJs = require('strip-js');
//cloudinary configuration
cloudinary.config({
 cloud_name: 'pavneet07',
 api_key: '619155739842222',
 api_secret: 'FrUbofr_QvEiqDzdB2as_N4bHss',
 secure: true
});
//
const upload = multer();
//DEFINE TEMPALATE ENGINE
app.engine('.hbs', exhbs.engine({
  extname: '.hbs', 
  helpers: {
    navLink: function(url, options){
 return '<li' +
 ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
 '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
 if (arguments.length < 3)
 throw new Error("Handlebars Helper equal needs 2 parameters");
 if (lvalue != rvalue) {
 return options.inverse(this);
 } else {
 return options.fn(this);
 }
    },
    safeHTML: function(context){
 return stripJs(context);
}

  }
}))
//for specifying view-engine
app.set('view engine', '.hbs');

app.use(express.static("public"));
//for adding sctive routes
app.use(function(req,res,next){
 let route = req.path.substring(1);
 app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
 app.locals.viewingCategory = req.query.category;
 next();
});
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.redirect("/blog");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
   res.render('about')
});
app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blog.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blog.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blog.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});
app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blog.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blog.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blog.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blog.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});
app.get("/posts", function (req, res) {
  //for the route /posts?category=value
  if (req.query.category) {
    blog. getPostsByCategory(req.query.category).then((data) => {
    res.render("posts", {info: data});
    }).catch(function(err){
       res.render("posts",{message: "no results"});
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
      res.render("posts", {info:data})
    })
    .catch(function (err) {
      res.render("posts", {message: "no results"});
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
      res.render("categories", {info: data});
    })
    .catch(function (err) {
      res.render("categories",{message: "no results"});
    });
});
app.get("/posts/add", function (req, res) {
  res.render('addPost');
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
  res.status(404).render('404');
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
