//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const homeStartingContent = "abcd"

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-swastika:test123@cluster0.yqol0.mongodb.net/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
  email: String,
  password: String
};

const User = new mongoose.model("User", userSchema);

let posts = [];

app.get("/", function(req, res){
if(posts.length === 0){
  res.render("home", {

    name: homeStartingContent,
    content: homeStartingContent,
    secondname: homeStartingContent,
    secondcontent: homeStartingContent,
    thirdname: homeStartingContent,
    thirdcontent: homeStartingContent
  });
}
else if(posts.length === 1){
  res.render("home", {

    name: homeStartingContent,
    content: homeStartingContent,
    secondname: homeStartingContent,
    secondcontent: homeStartingContent,
    thirdname: name,
    thirdcontent: content
  });
}
else if(posts.length === 2){
  res.render("home", {

    name: homeStartingContent,
    content: homeStartingContent,
    secondname: secondname,
    secondcontent: secondcontent,
    thirdname: name,
    thirdcontent: content
  });
}
else{
  res.render("home", {

    name: thirdname,
    content: thirdcontent,
    secondname: secondname,
    secondcontent: secondcontent,
    thirdname: name,
    thirdcontent: content
  });
}


    });






app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
newUser.save(function(err){
  if(err) {
    console.log(err);
  }
  else {
    res.render("compose");
  }
});
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("compose");
        } else {
          res.render("failed");
        }
      } else{
        res.render("failed");
      }
    }
  });
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };


  posts.push(post);
name = posts[posts.length-1].title;
content = posts[posts.length-1].content;
if(posts.length >= 2){
if(posts.length=== 2){
  secondname = posts[posts.length-2].title;
  secondcontent = posts[posts.length-2].content;
}
else{
  secondname = posts[posts.length-2].title;
  secondcontent = posts[posts.length-2].content;
  thirdname = posts[posts.length-3].title;
  thirdcontent = posts[posts.length-3].content;

}
}

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
