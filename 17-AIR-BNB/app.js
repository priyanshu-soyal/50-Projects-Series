// require dotenv
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// --> require express
const express = require("express");
const app = express();

// todo:  requires -
// --> require ExpressError.js
const ExpressError = require("./utils/ExpressError");

// --> require listingRoute
const listingRoute = require("./routes/listingsRoute");

// --> require reviewRoute
const reviewRoute = require("./routes/reviewRoute");

// --> require userRoute
const userRoute = require("./routes/userRoute");

// --> require session
const session = require("express-session");

// --> require connect-mongo
const mongoStore = require("connect-mongo");

// --> require connent flash
const flash = require("connect-flash");

// --> require passport & local strategy
const passport = require("passport");
const LocalStrategy = require("passport-local");

// require User
const User = require("./models/User");

// todo: Built-in Middlewares :-
// --> use methodOverride
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// --> require path
const path = require("path");

// --> view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --> use ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// --> use public folder
app.use(express.static(path.join(__dirname, "/public")));

// --> parse the req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//todo: connect mongoose to mongoDB :-
// --> require mongoose
const mongoose = require("mongoose");

// --> require DB_URL
const DB_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(DB_URL);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

//idea:  create mongo store
const store = mongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
// idea: express-sessions :-
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // current date + cookie end time like 7 days in ms
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

// idea: connect-flash :-
app.use(flash());

// middleware for configure passport strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash msg :-
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// todo: Routes :-
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

// todo: custom error handler middleware :-
// --> error for page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
// --> error-handling middleware for all type of error
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`app is listen on http://localhost:${PORT}/listings`);
});
