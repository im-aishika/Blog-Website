const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

const port = (process.env.PORT || 3000);

// contents
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const contactContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let posts = [];

app.get("/", function(req, res) {
  res.render("home",  {homeContent: homeStartingContent, posts: posts});
})

app.get("/about", function(req, res) {
  res.render("about", {abtContent: aboutContent});
})

app.get("/contact", function(req, res) {
  res.render("contact", {contContent: contactContent});
})

app.get("/compose", function(req, res) {
  res.render("compose");
})

app.get("/posts/:topic", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.topic);

  posts.forEach(function(element) {
    const storedTitle = _.lowerCase(element.title);

    if(storedTitle === requestedTitle) {
      res.render("posts",  {postTitle: element.title, postContent: element.content});
    }
  })


})

app.post("/compose", function(req, res) {

  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };

  posts.push(post);
  res.redirect("/");
})

app.listen(port, function() {
  console.log(`Server is listening to port ${port} `);
})
