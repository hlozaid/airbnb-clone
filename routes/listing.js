const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Middleware: validate listing data safely
const validateListing = (req, res, next) => {
  // Guard against missing body / missing listing key BEFORE validating
  if (!req.body || !req.body.listing) {
    return next(new ExpressError(400, "Send valid data for listing"));
  }

  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

// Index Route
router.get("/", wrapAsync(listingController.index));

// New listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListinng));

// Create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing),
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/edit.ejs", { listing });
  }),
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }),
);

module.exports = router;
