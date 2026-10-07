const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isReviewAuthor,
  validateReview,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Post review (pehle login check, phir validation)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReviews),
);

// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReviews),
);

module.exports = router;