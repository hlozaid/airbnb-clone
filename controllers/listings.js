const Listing = require("../models/listings");
const ExpressError = require("../utils/ExpressError.js");
const { cloudinary } = require("../cloudConfig.js");
const { CATEGORY_VALUES } = require("../utils/categories.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// User input ko regex me daalne se pehle special characters escape karo
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.index = async (req, res) => {
  // ?q=goa&category=pool  (dono optional, dono saath me bhi chalte hain)
  const q =
    typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const category =
    typeof req.query.category === "string" &&
    CATEGORY_VALUES.includes(req.query.category)
      ? req.query.category
      : "";

  const filter = {};
  if (category) filter.category = category;

  if (q) {
    // Har word title/location/country me se kisi ek me milna chahiye
    const terms = q.split(/\s+/).filter(Boolean).slice(0, 5);
    filter.$and = terms.map((term) => {
      const rx = new RegExp(escapeRegex(term), "i");
      return { $or: [{ title: rx }, { location: rx }, { country: rx }] };
    });
  }

  const allListings = await Listing.find(filter);
  res.render("./listings/index.ejs", {
    allListings,
    q,
    activeCategory: category,
  });
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
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
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
  if (deleted && deleted.image && deleted.image.filename) {
    await cloudinary.uploader.destroy(deleted.image.filename);
  }
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
