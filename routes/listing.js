const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware.js");

const listingController = require("../controllers/listings.js");


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
  wrapAsync(listingController.renderEditForm),
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.updateListing),
);

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;
