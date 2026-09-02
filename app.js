const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Working");
});

//Index Route
app.get("/listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//new listing route
app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show Route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

//create route
app.post("/listings",async(req, res)=>{
  let {title, description, image, price, country, location } = req.body;

})

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
