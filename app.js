if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { setLocals, notFound, errorHandler } = require("./middleware.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const reviewsRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASTDB_URL;

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  console.log("DB URL loaded:", !!dbUrl);
  await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,        // only update the session in DB once per 24h unless data changes
  ttl: 7 * 24 * 60 * 60,        // sessions expire after 7 days (in seconds)
  autoRemove: "native",         // MongoDB deletes expired sessions automatically (default)
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// root route
app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(setLocals);

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
// 404 aur error handler (hamesha routes ke baad)
app.use(notFound);
app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
