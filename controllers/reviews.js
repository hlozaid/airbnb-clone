const Listing = require("../models/listings");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReviews = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  newReview.author = req.user._id;
  await newReview.save();
  await listing.save();

  req.flash("success", "Review Added!");

  console.log("review Saved!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReviews = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");

  res.redirect(`/listings/${id}`);
};