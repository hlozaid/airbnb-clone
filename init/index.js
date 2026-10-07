const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6abcf0edde3d2328c3ced697",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
