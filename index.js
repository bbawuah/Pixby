require("dotenv").config();
// packages
const hbs = require("hbs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express(); // opstarten van express applicatie
const port = 4000;
const path = require("path");

// require feature modules
const likeAndMatch = require("./src/routes/likeAndMatch");
const chatRoom = require("./src/routes/chatRoom");
const findUser = require("./src/routes/findUser");
const profileUser = require("./src/routes/profile");

// Load in mongoose and make connection to database
require("./src/db/mongoose.js");

const userJSON = require("./pixby-users.json");

// Load in model
const User = require("./src/models/users");

// Example of how to create CRUD operations
(async () => {
  const users = await User.find({}); //User refers to our User model. We don't have to use db.collection anymore
  console.log(users);
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
app
  .use("/", likeAndMatch)
  .use("/", chatRoom)
  .use("/", findUser)
  .use("/", profileUser);



// Jo-Ann's feature
app
  .get("/signin", signIn)
  .post("/loading", loadSignIn)
  .get("/", home)
  .post("/match", match)
  .post("/profile", profile)
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

// indexpagina
async function home(req, res, next) {
  try {
    const signedUser = await User.findOne({
      name: 'Collin'
    })
    // alle gebruikers uit de database gehaald zonder signedUser mee te nemen
    const allBabies = await User.find({
      $and: [{
          name: {
            $ne: signedUser.name,
          },
        },
        {
          name: {
            // array waar alle gelikete users in worden opgeslagen
            // waardoor hij niet meer zichtbaar is op de index
            $nin: Object.values(signedUser.liked),
          },
        },
        {
          name: {
            // array waar alle gelikete users in worden opgeslagen
            // waardoor hij niet meer zichtbaar is op de index
            $nin: Object.values(signedUser.disliked),
          },
        },
      ],
    });
    // allBabies wordt gerendert naar de index
    res.render("index", {
      title: "home",
      users: allBabies,
    });
  } catch (error) {
    next(error);
  }
}

// Als je iemand liked of disliked wordt het hele object
// van de gebruiker gepusht naar je liked of disliked array
function updateLikedUsers(req, res) {
  if (req.body) {
    User.updateOne({
      name: signedUser.name,
    }, {
      $push: {
        liked: req.body.like,
      },
    });
    return true;
  }
};

function updateDislikedUsers(req, res) {
  if (req.body) {
    User.updateOne({
      name: signedUser.name,
    }, {
      $push: {
        liked: req.body.dislike,
      },
    });
    return false;
  }
};

// gelikete user wordt doorgestuurd naar match pagina
async function match(req, res, next) {
  try {
    const signedUser = await User.findOne({
      name: 'Collin'
    })

    // het hele object van de gematchte user wordt uit de database gehaald
    // zodat je alleen de user die je hebt geliked/matched op de match pagina te zien krijgt
    const match = await User
      .find({
        name: req.body.like
      });
    console.log(req.body.like)
    // updateUsers wordt aangeroepen waarbij een argument wordt meegegeven
    // als de gematchte waarde true is, dan heb je een match en wordt gerenderd naar match route
    if (updateLikedUsers(signedUser) === true) {
      console.log(`you have a match with ${match.name} `);
      res.render("match", {
        users: match,
      });
      // als de gematchte waarde false is, wordt je teruggestuurd naar de index
    } else if (updateDislikedUsers(signedUser) === false) {
      console.log(`no match.`);
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
}

// profile pagina van de gematchte baby wordt revealed naar de volwassen jochie.
async function profile(req, res) {
  try {
    const signedUser = await User.find({
        name: 'Collin'
      })
      .toArray();
    const allLikedBabies = signedUser.liked;
    // zorgt voor dat de array niet telt vanaf 0
    // en die waarde wordt in likedUser meegegeven als de index
    const likedBaby = allLikedBabies.length - 1;
    const likedUser = allLikedBabies[likedBaby];
    // hele object van de gelikete user wordt uit de database gehaald
    const showMatch = await User.find({
        name: likedUser,
      })
      .toArray();
    // rendert de gelikete user naar de profile pagina
    res.render("profile", {
      users: showMatch,
    });
  } catch (err) {
    res.status(404).send(err);
  }
}

// rendert error pagina
function error(req, res) {
  res.status(404).render("error");
}

// Application running on port...
app.listen(port, () => console.log(`app draait op port ${port}!!`));