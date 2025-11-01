// todo: important thing require :-

// --> require review model
// const Review = require("../models/Reviews");

// todo: Middlewares :-
// for check user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You must be login to create listing");
    return res.redirect("/login");
  }
  next();
};

// for path login page
module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

// // isReviewAuthor for verify the review author
// module.exports.isReviewAuthor = async (req, res, next) => {
//   let { reviewId } = req.params;
//   let review = await Review.findById(reviewId);
//   if (!review.author._id.equals(res.locals.currUser._id)) {
//     return res.redirect();
//   }
// };
