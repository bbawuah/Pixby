const User = require('../models/users')

function profileUser(req, res) {
  console.log('im running')
  try {
    // SAVE ID FROM ROUTE INTO PROFILEID VARIABLE
    const userID = req.params.id
    console.log(userID)

    // SEARCH DATABASE FOR PROFILE WITH THIS ID
    User.findOne(
      {
        _id: userID,
      },
      userIDFound, // RUN FUNCTION WHEN USER FOUND
    )

    function userIDFound(err, foundUser) {
      console.log(foundUser.name)
      if (err) {
        res.redirect('notFound')
      } else {
        console.log('rendering profile...')
        res.render('profile', {
          user: req.user,
          likedUser: foundUser,
        })
      }
    }
  } catch (err) {
    res.status(404).send(err)
  }
}

module.exports = profileUser
