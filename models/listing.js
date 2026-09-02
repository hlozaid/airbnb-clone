const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let imageLink =
  "https://plus.unsplash.com/premium_photo-1781034651731-10902364135a?q=80&w=910&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: imageLink,
    set: (v) => (v === "" ? imageLink : v),
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
