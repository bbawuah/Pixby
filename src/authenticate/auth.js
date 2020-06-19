const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {

  const token = req.cookies["access_token"];

  try {
    // Check JWT token
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

    // Check User schema and probeer een user te vinden
    const user = await User.findOne({
      _id: decoded._id,
      // Find a user with a correct auth token STILL stored
      "tokens.token": token,
    });

    // If there is no user throw an Errorrr
    if (!user) {
      throw new Error();
    }

    // Als je wel een user kan vinden, plaats dan de user in de req.user
    req.user = user;

    // End of middlewareeeee
    next();
  } catch (e) {
    // If authentication fails, send error to authenticate to user
    console.log("Eerst inloggguuuh");
    res.status(401)
    res.redirect('http://localhost:3000');
  }
};

module.exports = auth;
