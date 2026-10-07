const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const fs = require("fs");
const { CATEGORIES } = require("./utils/categories.js");

// Validation fail ho to multer ki save ki hui file delete kar do
const discardUpload = (req) => {
  if (req.file) fs.unlink(req.file.path, () => {});
};

module.exports.validateListing = (req, res, next) => {
  // Guard against missing body / missing listing key BEFORE validating
  if (!req.body || !req.body.listing) {
    discardUpload(req);
    return next(new ExpressError(400, "Send valid data for listing"));
  }

  let { error } = listingSchema.validate(req.body);
  if (error) {
    discardUpload(req);
    let errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  if (!req.body || !req.body.review) {
    return next(new ExpressError(400, "Review is Required!"));
  }
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Express 5 async middleware ke errors khud handle kar leta hai,
// isliye yahan wrapAsync ki zarurat nahi.
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
// ---------- App-level middlewares (app.js me use hote hain) ----------

// Flash messages aur logged-in user ko saare views me available karata hai
module.exports.setLocals = (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // Search/filter defaults so navbar & views never hit an undefined variable
  res.locals.q = "";
  res.locals.activeCategory = "";
  res.locals.categories = CATEGORIES;
  next();
};

// Koi route match na ho to 404
module.exports.notFound = (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
};

// Final error handler (4 arguments zaruri hain)
module.exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let { statusCode = 500, message = "Something went wrong" } = err;
  // Multer errors (file too large, unexpected field, wrong type) => 400
  if (err.name === "MulterError") statusCode = 400;
  if (err.message === "Only JPG, PNG, WEBP or GIF images are allowed") {
    statusCode = 400;
  }
  res.status(statusCode).render("listings/error.ejs", { message });
};