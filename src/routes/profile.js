// require("dotenv").config();
// const router = require('express').Router();


// module.exports = router;

const User = require("../models/users");

// profile pagina van de gematchte baby wordt revealed naar de volwassen jochie.
async function profile(req, res) {
  try {
    const signedUser = await User.find({
      name: "Collin",
    }).toArray();
    const allLikedBabies = signedUser.liked;
    // zorgt voor dat de array niet telt vanaf 0
    // en die waarde wordt in likedUser meegegeven als de index
    const likedBaby = allLikedBabies.length - 1;
    const likedUser = allLikedBabies[likedBaby];
    // hele object van de gelikete user wordt uit de database gehaald
    const showMatch = await User.find({
      _id: likedUser._id,
    }).toArray();
    // rendert de gelikete user naar de profile pagina
    res.render("profile", {
      users: showMatch,
    });
  } catch (err) {
    res.status(404).send(err);
  }
}

module.exports = profile;