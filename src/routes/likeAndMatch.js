const User = require("../models/users");


// Als je iemand liked of disliked wordt het hele object
// van de gebruiker gepusht naar je liked of disliked array
async function updateLikedUsers(match, user) {
  console.log("Deze is afgevuurd");
  console.log(`Dit is van req ${match}`);

  try {
    await User.updateOne({
      _id: user._id,
    }, {
      $push: {
        liked: match,
      },
    });
    return true;
  } catch (erooorrrr) {
    console.log(erooorrrr);
  }
}


async function updateDislikedUsers(noMatch, user) {
  console.log("Deze is afgevuurd");
  console.log(`Dit is van ${noMatch}`);

  console.log(user._id)

  try {
    await User.updateOne({
      _id: user._id,
    }, {
      $push: {
        disliked: noMatch,
      },
    });
    return false;
  } catch (ewajaaaaa) {
    console.log(ewajaaaaa);
  }
}


// gelikete user wordt doorgestuurd naar match pagina
async function match(req, res, next) {
  const like = req.body.like;
  const dislike = req.body.dislike;


  try {
    const signedUser = await User.findOne({
      _id: req.user._id,
    });

    console.log(signedUser);

    // het hele object van de gematchte user wordt uit de database gehaald
    // zodat je alleen de user die je hebt geliked/matched op de match pagina te zien krijgt
    const match = await User.find({
      _id: like,
    });

    // updateUsers wordt aangeroepen waarbij een argument wordt meegegeven
    // als de gematchte waarde true is, dan heb je een match en wordt gerenderd naar match route

    if (match[0]) {
      updateLikedUsers(like, signedUser)
      console.log(match[0])
      console.log(`you have a match with ${match[0].name} `);
      res.render("match", {
        users: match,
      });

      // als de gematchte waarde false is, wordt je teruggestuurd naar de index
    } else {
      updateDislikedUsers(dislike, signedUser)
      console.log(`no match.`);
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }

}

module.exports = match