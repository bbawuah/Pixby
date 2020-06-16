const User = require("../models/users");
const { db } = require("../models/users");


// indexpagina
async function home(req, res, next) {
  try {
    const signedUser = await User.findOne({
      _id: req.user._id,

    });

    console.log(signedUser)
    // alle gebruikers uit de database gehaald zonder signedUser mee te nemen
    const allBabies = await User.find({
      $and: [{
          _id: {
            $ne: signedUser._id,
          },
        },
        {
          _id: {
            // array waar alle gelikete users in worden opgeslagen
            // waardoor hij niet meer zichtbaar is op de index
            $nin: signedUser.liked,
          },
        },
        {
          _id: {
            // array waar alle gelikete users in worden opgeslagen
            // waardoor hij niet meer zichtbaar is op de index
            $nin: signedUser.disliked,
          },
        },
      ],
    });
    // allBabies wordt gerendert naar de index
    res.render("home", {
      title: "home",
      user: signedUser,
      users: allBabies,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = home;


