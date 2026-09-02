const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Listing = require("./models/listing.js");

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

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     discription: " My Des",
//     price: 1200,
//     location: "Ighri",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved")
//   res.send("Ho gya bhai ho gya!")
// });

app.listen(8080, () => {
  console.log("Server is listing to port 8080");
});
