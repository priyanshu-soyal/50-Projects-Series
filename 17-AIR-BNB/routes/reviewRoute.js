const express = require("express");
const router = express.Router({ mergeParams: true });

// todo: important thing require :-
// --> require wrapAsync.js
const wrapAsync = require("../utils/wrapAsync");

// --> require ExpressError.js
const ExpressError = require("../utils/ExpressError");

// --> require joiSchema.js
const { joiReviewSchema } = require("../joiSchema");

// --> require isLoggedIn
const { isLoggedIn } = require("../Middelwares.js");

// --> require reviewsController
const reviewsController = require("../Controllers/reviewsController.js");

// idea: error handling for validation for & empty data schema with joiReviewSchema as middleware :-
const validateReviews = (req, res, next) => {
  let { error } = joiReviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(500, errMsg);
  } else {
    next();
  }
};

// --> Route for create reviews :-
router.post(
  "/",
  isLoggedIn,
  validateReviews,
  wrapAsync(reviewsController.createReview)
);
// --> delete req for delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
