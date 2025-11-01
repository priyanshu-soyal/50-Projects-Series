const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/Listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "690313b521de51f40ccc7754",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
