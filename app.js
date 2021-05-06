const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const fs = require('fs');
const _ = require("lodash");

const app = express();
const port = 3000;

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine
app.use(express.static('public'));

// ....
app.use(bodyParser.urlencoded({extended: true}));
// ....

// Database connection and models
mongoose.connect('mongodb://localhost:27017/blog_database', {useNewUrlParser: true, useUnifiedTopology: true})
        .catch(error => console.log("Something went wrong: " + error));
var blogModel = require("./models/blog");

// Configs
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/views'));

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




// ...............To do list.......

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/list", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/list");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/list" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });



});

app.post("/list", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/list");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/list" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/list");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/list" + listName);
      }
    });
  }


});



// .....................

app.listen(port, () => console.log(`Listening on port ${port}!`));
