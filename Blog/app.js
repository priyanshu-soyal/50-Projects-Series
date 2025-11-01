const express = require("express");
const app = express();
const path = require("path");


// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

// public
app.use(express.static("Public"))
app.set("Public", path.join(__dirname, "Public"))

// ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// parse the data
app.use(express.urlencoded({extended:true}))
app.use(express.json())


// idea: Routes :-
// allPosts route
app.get("/blogify/posts", async (req, res) => {
    let allPost = await Post.find();
    res.render("Components/allPosts.ejs", {allPost})
})

// singlePost route
app.get("/blogify/post/:id", async(req, res) => {
    let {id} = req.params;
    const post = await Post.findById(id);
    res.render("Components/singlePost.ejs", {post});
})

// newPost route
app.get("/blogify/newPost", (req, res) => {
    res.render("Components/newPost.ejs")
})

app.post("/blogify/posts", async(req, res) => {
    let {title, description, author, image } = req.body;
    let data = {title, description, author, image };
    await Post.insertMany(data);
    res.redirect("/blogify/posts")
})

// login route
app.get("/blogify/login", (req, res) =>{
    res.render("Components/login.ejs")
})

// register route
app.get("/blogify/register", (req, res) =>{
    res.render("Components/register.ejs")
})



// mongoose :-
const Post = require("./models/Posts")
const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/BlogDB";
async function main() {
    await mongoose.connect(mongoURL);    
}
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})


const port = 8080;
app.listen(port, () => {
    console.log(`server is listen on http://localhost:${port}`)
})