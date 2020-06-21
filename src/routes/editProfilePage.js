const User = require("../models/users");

function editProfilePage(req, res) {
  console.log('Rendering editProfile');
  res.render('editProfile');
}

module.exports = editProfilePage
