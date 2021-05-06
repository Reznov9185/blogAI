const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine
app.use(express.static('public'));

// Database connection and models
mongoose.connect('mongodb://localhost:27017/blog_database', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .catch(error => console.log("Something went wrong: " + error));
var blogModel = require("./models/blog");
const { update } = require('./models/blog');

// Configs
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/views'))
app.use( function( req, res, next ) {
  if ( req.query._method == 'DELETE' ) {
      req.method = 'DELETE';
      req.url = req.path;
  }       
  next(); 
});;

// Application Index
app.get('/', (req, res) => {
  blogModel.listAllBlogs().then(function(blogs){
    res.render("index", {data:blogs});
  }).catch(function(error){
      res.status(500).send({ error: 'Something went wrong! ' + error });
  });
});

// Blog create
app.get('/blogs/create', (req, res) => {
  res.render('blogs/create');
});

// Blog save
app.post('/blogs/save', (req, res) => {
  var newBlog = new blogModel(req.body.blog);
  newBlog.save().then(function(){
    res.redirect('/');
  }).catch(function(error){
        res.status(500).send({ error: 'Failed to add new blog! ' + error});
  });
});

// Blog update
app.post('/blogs/update/:id', (req, res) => {
  blogModel.findOneAndUpdate({_id: req.params.id}, req.body.blog, null).then(function() {
    res.redirect('/');
  }).catch(function(error){
        res.status(500).send({ error: 'Failed to update new blog! ' + error});
  });
});

app.delete('/blogs/delete/:id', (req, res) => {
  blogModel.findByIdAndDelete({_id: req.params.id}, null, null).then(function() {
    res.redirect('/');
  }).catch(function(error){
        res.status(500).send({ error: 'Failed to delete the blog! ' + error});
  });
});

// Blog index
app.get('/blogs/:id', (req, res) => {
  var blogId = req.params.id;
  blogModel.fetchBlog(blogId).then(function(blog){
    res.render("blogs/index", {data:blog});
  }).catch(function(error){
      res.status(500).send({ error: 'Something went wrong! ' + error });
  });
});

// Blog Edit
app.get('/blogs/edit/:id', (req, res) => {
  var blogId = req.params.id;
  blogModel.fetchBlog(blogId).then(function(blog){
    res.render("blogs/edit", {data:blog});
  }).catch(function(error){
      res.status(500).send({ error: 'Something went wrong! ' + error });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
