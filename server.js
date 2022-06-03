/***********************************************************************
**********
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: ____Pavneet Kaur__________________ Student ID: __128287216____________ Date: 
__________6/2/2022______
*
* Online (Heroku) Link: 
___https://damp-ridge-83837.herokuapp.com_____________________________________________________
*
************************************************************************
********/
var express = require("express");
var app = express();
var path = require("path");
var blog = require("./blog-service.js");




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
  blog
    .getAllPosts()
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
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
