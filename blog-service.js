
const Sequelize = require('sequelize');
var sequelize = new Sequelize('dbg8cuj3i02og7', 'tuhnhsfapewlos', '0407bab8e8f4187a4df5388f16e5bd0597cc5af59bfc466dd7b9c58228432d8b', {
 host: 'ec2-34-193-44-192.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 },
 query: { raw: true }
});
var Post = sequelize.define('Post',{
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published:Sequelize.BOOLEAN,
})
var Category = sequelize.define('Category',{
    category: Sequelize.STRING,
})
Post.belongsTo(Category, {foreignKey: 'category'})

function initialize(){
    return new Promise(function(resolve,reject){
        sequelize.sync()
        .then(function(){
            resolve("database synced Successfully")
            })
        .catch(function() {reject("Unable to sync the database")})
        })
}

function getAllPosts () {
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Post.findAll().then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))})
        })
    })
}

function getPostsByCategory (input) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(){
            Post.findAll({ 
                where:{category: input}
            }).then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))});
        })
    });
}

function getPublishedPosts () {
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Post.findAll({ 
                where:{published: true}
            }).then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))});
        })
    });
}

function getCategories(){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Category.findAll().then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))});
        })
    })
}

function getPublishedPostsByCategory(input){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            Post.findAll({ 
              where: {
                published: true,
                category: input
              }
            }).then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))});
        })
    });
}

function addPost (postData){
    return new Promise ((resolve,reject)=>{
       for (var i in postData) {
         if (postData[i] == "")
         { postData[i] = null; }
        }
        postData.published = (postData.published) ? true : false;
        postData.postDate =new Date()
        sequelize.sync().then(function(){
          Post.create(postData)
            .then(resolve(console.log("post created successfully")))
            .catch(function () { reject("Unable to create post") });
         })
    })
}

function getPostsByMinDate(minDateStr){
    return new Promise(function(resolve,reject){
            sequelize.sync().then(function(){
            Post.findAll({ 
                where: {
                    postDate: {
                    [gte]: new Date(minDateStr)
                    }
                }
            }).then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))});
        })
    })
}

function getPostById(identity){
    return new Promise ((resolve,reject)=>{
        sequelize.sync().then(function(){
            Post.findAll({ 
                where:{id: identity}
            }).then(function(data){        
                resolve(data)
            }).catch(function() {reject(console.log("no results returned"))});
        })
    })
}

function addCategory(categoryData){
    return new Promise ((resolve,reject)=>{
        if(categoryData.category == ""){
            categoryData.category = null;
        }
        sequelize.sync().then(function(){
          Category.create(categoryData)
            .then(resolve(console.log("category created successfully ")))
            .catch(reject("Unable to create category"));
        })
    })
}

function deleteCategoryById(identity){
    return new Promise ((resolve,reject)=>{
        sequelize.sync().then(function(){
            Category.destroy({
                where: {id: identity}
            }).then(resolve(console.log("category deleted successfully")))
              .catch(reject("Unable to delete category"));
        })
    })
}

function deletePostById(identity){
    return new Promise ((resolve,reject)=>{
        sequelize.sync().then(function(){
            Post.destroy({
                where: {id: identity}
            })
              .then(resolve(console.log("post deleted  successfully")))
              .catch(reject("Unable to delete category"));
        })
    })
}

module.exports = {
  getCategories,
  getPublishedPosts,
  getAllPosts,
  initialize,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostsByCategory,
  getPostById,
  getPublishedPostsByCategory,
  addCategory,
  deleteCategoryById,
  deletePostById
} 