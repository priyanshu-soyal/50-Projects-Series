// todo: important thing require :-
// --> require User Model
const User = require("../models/User");

// todo: user controllers :-
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    // for automatic login after signup
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome  on Wonderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to wonderlust!");
  let redirectURL = res.locals.redirectURL || "/listings";
  res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
  // for logout the user
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
