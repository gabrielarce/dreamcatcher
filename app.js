const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const path = require("path");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/database");
const dreamRoutes = require("./routes/dreams");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const MongoStore = require("connect-mongo");
const { db } = require("./models/Dream");
require("dotenv").config();

// Passport config
require("./config/passport")(passport);

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SESSIONS
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    //!Change: MongoStore syntax has changed
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

//Use forms for put / delete
app.use(methodOverride("_method"));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//SET GLOBAL VARIABLE
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//ROUTES
app.get("/", (request, response) => {
  response.render("index");
});

app.use("/auth", authRoutes);
app.use("/api/dreams", dreamRoutes);
app.use("/comment", commentRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("listening on port 9000");
});
