const Listing = require("../models/listings");
const ExpressError = require("../utils/ExpressError.js");
const { cloudinary } = require("../cloudConfig.js");

<<<<<<< HEAD
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

=======
>>>>>>> 7fb0d1c9406ce69558c460d0f1dcf81a49007cb6
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListinng = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
<<<<<<< HEAD
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);

=======
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "...", filename);
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {url,filename};
  }
  await newListing.save();
>>>>>>> 7fb0d1c9406ce69558c460d0f1dcf81a49007cb6
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
<<<<<<< HEAD
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
=======
>>>>>>> 7fb0d1c9406ce69558c460d0f1dcf81a49007cb6
  if (req.file) {
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
<<<<<<< HEAD
  if (deleted && deleted.image && deleted.image.filename) {
    await cloudinary.uploader.destroy(deleted.image.filename);
  }
=======
  if (deleted) removeLocalImage(deleted.image);
>>>>>>> 7fb0d1c9406ce69558c460d0f1dcf81a49007cb6
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
