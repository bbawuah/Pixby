require("dotenv").config();
// packages
const hbs = require("hbs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express(); // opstarten van express applicatie
const port = 4000;
const path = require("path");

const register = require("./src/routes/register");
const auth = require('./src/authenticate/auth');
const match = require("./src/routes/likeAndMatch");
const chatRoom = require("./src/routes/chatRoom");
const findUser = require("./src/routes/searchUser");
const profileUser = require("./src/routes/profile");
const home = require('./src/routes/home');
const error = require('./src/routes/error');
const index = require('./src/routes/index');
// Load in mongoose and make connection to database
require("./src/db/mongoose.js");

const userJSON = require("./pixby-users.json");

// Load in model
const User = require("./src/models/users");
const cookieParser = require("cookie-parser");


// Example of how to create CRUD operations
(async () => {
  const users = await User.find({}); //User refers to our User model. We don't have to use db.collection anymore
  // console.log(users);
})();



// middleware
app
  .set("view engine", "hbs")
  .set("views", "views")
  .use(express.static("public"))
  .use(express.json()) // gebruikt deze map (public) om html bestanden te serveren
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  .use(register)
  .use(cookieParser())

hbs.registerPartials(path.join(__dirname, "/views/partials"));


app
  .get('/', index)
  .get("/home", auth, home)
  .post("/match", auth, match)
  .post("/profile/:id", auth, profileUser)
  .get("/*", error);

// Application running on port...
app.listen(3000, () => console.log(`app draait op port ${port}!!`));