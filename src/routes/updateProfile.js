const User = require("../models/users");

async function updateProfile(req, res) {
  // SEARCH DATABASE FOR PROFILE WITH HIS ID
  console.log('ideetje is ' + req.user._id);
  console.log('age is ' + req.body.age);
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      age: parseInt(req.body.age), //CONVERT TO INTEGER
      location: req.body.location,
      profession: req.body.profession,
      about: req.body.about
    }
  )
  res.redirect('home');
}

module.exports = updateProfile
