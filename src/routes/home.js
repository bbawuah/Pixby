const User = require('../models/users')


// home page
async function home(req, res, next) {
  try {
    const signedUser = await User.findOne({
      _id: req.user._id,

    })

    console.log(signedUser)
    // displaying all the babies except for the signedUser
    const allBabies = await User.find({
      $and: [{
        _id: {
          $ne: signedUser._id,
        },
      },
      {
        _id: {
          // all liked users are saved in the liked array
          // this operator wont let the liked user appear in the homepage
          $nin: signedUser.liked,
        },
      },
      {
        _id: {
          // all liked users are saved in the liked array
          // this operator wont let the liked user appear in the homepage
          $nin: signedUser.disliked,
        },
      },
      ],
    })
    // allBabies renders to the homepage
    res.render('home', {
      title: 'home',
      user: signedUser,
      users: allBabies,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = home
