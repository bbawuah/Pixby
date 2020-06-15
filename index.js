require("dotenv").config();
// packages
const hbs = require("hbs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express(); // opstarten van express applicatie
const port = 4000;
const path = require("path");

const match = require("./src/routes/likeAndMatch");
const chatRoom = require("./src/routes/chatRoom");
const findUser = require("./src/routes/searchUser");
const profileUser = require("./src/routes/profile");
const home = require('./src/routes/home');
// Load in mongoose and make connection to database
require("./src/db/mongoose.js");

const userJSON = require("./pixby-users.json");

// Load in model
const User = require("./src/models/users");


// Example of how to create CRUD operations
(async () => {
  const users = await User.find({}); //User refers to our User model. We don't have to use db.collection anymore
  // console.log(users);
})();

// middleware
app
  .set("view engine", "hbs")
  .set("views", "views")
  .use(express.static("public")) // gebruikt deze map (public) om html bestanden te serveren
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

hbs.registerPartials(path.join(__dirname, "/views/partials"));

// mount the routes to the app
// app
//   .use("/", match)
//   .use("/", chatRoom)
//   .use("/", findUser)
//   .use("/", profileUser);

// Jo-Ann's feature
app
  .get("/signin", signIn)
  .post("/loading", loadSignIn)
  .get("/", home)
  .post("/match", match)
  .post("/profile/:id", profileUser)
  .get("/*", error);

// inlogpagina waar alle session gebruikers worden weergeven
async function signIn(req, res, next) {
  try {
    const fromDatabase = await User.find().toArray();
    res.render("signin", {
      title: "signin",
      users: fromDatabase,
    });
  } catch (error) {
    next(error);
  }
}

// hier wordt je doorgestuurd naar de indexpagina
async function loadSignIn(req, res, next) {
  try {
    //Hier komt logic voor json webtoken
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}


// rendert error pagina
function error(req, res) {
  res.status(404).render("error");
}

// Application running on port...
app.listen(3000, () => console.log(`app draait op port ${port}!!`));
