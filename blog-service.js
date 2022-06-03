const file = require("fs"); //to use file system module

var posts = [];
var categories = [];

initialize = () => {
  return new Promise((resolve, reject) => {
    file.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
         posts= JSON.parse(data); 
      }
    });

    file.readFile("./data/categories.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read file");
      } else {
        categories=JSON.parse(data); 
      }
    });
    resolve();
  });
};
getAllPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length == 0) {
      reject("no results returned");
    } else {
      resolve(posts);
    }
  });
};

getPublishedPosts = () => {
  
  return new Promise((resolve, reject) => {
    var publish = posts.filter(post => post.published === true)
    if (publish.length === 0) { 
    reject("no results returned");
  }
  else {
    resolve(publish)
  }  
     
  });
};

getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length == 0) {
      reject("no results returned");
    } else {
      resolve(categories);
    }
  });
};
module.exports = {
    initialize,
    getAllPosts,
    getPublishedPosts,
    getCategories
}
