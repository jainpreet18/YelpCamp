const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview } = require("../middleware");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const ReviewController = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(ReviewController.postReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(ReviewController.deleteReview)
);

module.exports = router;
