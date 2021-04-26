const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine
app.use(express.static('public'));

// Database connection and models
mongoose.connect('mongodb://localhost:27017/blog_database', {useNewUrlParser: true, useUnifiedTopology: true})
        .catch(error => console.log("Something went wrong: " + error));
var blogModel = require("./models/blog");

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
  blogModel.listAllBlogs().then(function(blogs){
    res.render("index", {data:blogs});
  }).catch(function(error){
      res.status(500).send({ error: 'Something went wrong! ' + error });
  });
});

app.get('/blogs/create', (req, res) => {
  res.render('blogs/create');
});

app.post('/blogs/save', (req, res) => {
  var newBlog = new blogModel(req.body.blog);
  newBlog.save().then(function(){
    res.redirect('/');
  }).catch(function(error){
        res.status(500).send({ error: 'Failed to add new blog! ' + error});
  });
});

app.get('/blogs/:id', (req, res) => {
  var blogId = req.params.id;
  blogModel.fetchBlog(blogId).then(function(blog){
    res.render("blogs/index", {data:blog});
  }).catch(function(error){
      res.status(500).send({ error: 'Something went wrong! ' + error });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
