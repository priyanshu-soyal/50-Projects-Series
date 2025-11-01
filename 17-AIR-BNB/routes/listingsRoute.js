const express = require("express");
const router = express.Router();

// todo: important thing require :-
// --> require wrapAsync.js
const wrapAsync = require("../utils/wrapAsync");

// --> require ExpressError.js
const ExpressError = require("../utils/ExpressError");

// --> require joiSchema.js
const { joiListingSchema } = require("../joiSchema");

// --> require isLoggedIn middleware
const { isLoggedIn } = require("../Middelwares.js");

// --> require listings-controller
const listingsController = require("../Controllers/listingsController.js");

// --> require multer
const multer = require("multer");

// --> require cloudinary and storage
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// idea: error handling for validation for & empty data schema with joiListingSchema as middleware :-
const validateListing = (req, res, next) => {
  let { error } = joiListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(500, errMsg);
  } else {
    next();
  }
};

// todo: Routes :-

// --> get req for all listing || post req for create listing
router
  .route("/")
  .get(
    // add wrapAsync for async function in the route
    wrapAsync(listingsController.allListings)
  )
  .post(
    // for check user is logged in
    isLoggedIn,
    // for upload listing[image] in the cloud
    upload.single("listing[image]"),
    // --> for validate Listing
    validateListing,
    wrapAsync(listingsController.createListing)
  );

// --> get req for create new listings
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// --> get req for show particular listing || put req for update listing || delete req for Delete listing
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingsController.deleteListing));

// --> get req for edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
