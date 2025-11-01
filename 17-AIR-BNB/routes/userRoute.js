const express = require("express");
const router = express.Router();

// todo: important thing require :-
// --> require wrapAsync.js
const wrapAsync = require("../utils/wrapAsync");

// --> require passport
const passport = require("passport");

// --> require saveRedirectURL
const { saveRedirectURL } = require("../Middelwares.js");

// require userController
const userController = require("../Controllers/userController.js");

// todo: Routes :-

// --> get req for signup || post req for signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// --> get req for login || // post req for login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectURL,
    //   Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

// get req for logout
router.get("/logout", userController.logout);

module.exports = router;
