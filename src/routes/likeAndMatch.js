const User = require("../models/users");


// When you like or dislike someone, the whole object
// of the user pushes to the liked or disliked array

// the liked user updates the given id, and pushes
// the liked user to the liked array
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

// The disliked user updates the given id, and pushes
// the disliked user to the disliked array
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


// function match will render the liked user to the match page
async function match(req, res, next) {
  const like = req.body.like;
  const dislike = req.body.dislike;


  try {
    const signedUser = await User.findOne({
      _id: req.user._id,
    });


    console.log(signedUser);

    // The entire object of the matched user is taken from the database
    // in order to only see the liked user matched on the match page
    const match = await User.find({
      _id: like,
    });

    // if the match matches the liked user, it renders to the match page
    // or else when the user is disliked the user redirects to the home page
    if (match[0]) {
      updateLikedUsers(like, signedUser)
      console.log(match[0])
      console.log(`you have a match with ${match[0].name} `);
      res.render("match", {
        users: match,
      });

    } else {
      updateDislikedUsers(dislike, signedUser)
      console.log(`no match.`);
      res.redirect("/home");
    }
  } catch (error) {
    next(error);
  }

}

module.exports = match