const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

const port = (process.env.PORT || 3000);

// contents
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const contactContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');



mongoose.connect("mongodb://localhost:27017/myblogDB");

const blogPostSchema = {
  title: {
    type: String,
    required: true
  },
  _loVersion: String,
  content: {
    type: String,
    required: true
  }
}

const Post = mongoose.model("Post", blogPostSchema);

const homePost = new Post( {
  title: "Home",
  content: homeStartingContent
});

const defaultPost = [homePost];


app.get("/", function(req, res) {


  Post.find({}, function(err, foundPosts) {

    if(foundPosts.length === 0) {    
      
        res.render("home",  {homeContent: defaultPost[0].content, posts: []});

    } else {        
      res.render("home",  {homeContent: defaultPost[0].content, posts: foundPosts});
    }
  })

  
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

app.get("/post/:topic", function (req, res) {

  const requestedTitle = _.lowerCase(req.params.topic);

  Post.findOne({_loVersion: requestedTitle}, function(err, resPost) {
      if(err || !resPost){
          console.log("Not found");
      } else {

        const storedTitle = _.lowerCase(resPost.title);

        if(storedTitle === requestedTitle) {
              res.render("post",  {postTitle: resPost.title, postContent: resPost.content});
        }
        
        
      } //end of else    
  })  //end of find method

})

app.post("/compose", function(req, res) {

    const post_Title = req.body.postTitle;
    const postContent = req.body.postBody;
    const post_toLodash = _.lowerCase(post_Title);

    const post = new Post({
      title: post_Title,
      _loVersion: post_toLodash,
      content: postContent
    });

    post.save();
    res.redirect("/");
});


app.listen(port, function() {
  console.log(`Server is listening to port ${port} `);
});
