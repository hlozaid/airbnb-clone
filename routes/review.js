const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { createReviews } = require("../controllers/reviews.js");

const validataReview = (req, res, next) => {
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

const reviewController = require("../controllers/reviews.js");

//Reviews
//post Route
router.post(
  "/",
  validataReview,
  isLoggedIn,
  wrapAsync(reviewController.createReviews),
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReviews),
);

module.exports = router;
