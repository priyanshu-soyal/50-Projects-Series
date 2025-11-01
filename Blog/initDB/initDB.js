const mongoose = require("mongoose");
const sampleData = require("./data");
const Post = require("../models/Posts")
const mongoURL = "mongodb://127.0.0.1:27017/BlogDB";
async function main() {
    await mongoose.connect(mongoURL);    
}
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})

const init = async () => {
    await Post.deleteMany({});
    await Post.insertMany(sampleData.data);
    console.log("Data was Initialized");
}

init();