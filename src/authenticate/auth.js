const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
  // Why does this work thooo lol..
  //   https://stackoverflow.com/questions/43325754/how-to-verify-header-exist
  const authHeader = req.headers['x-access-token']
    || req.headers.Authorization
    || req.headers.authorization
    || req.body.headers.Authorization;

  try {
    // Store JWT token in variable from req.header(Authorization)
    const token = authHeader.replace('Bearer ', ''); // Remove 'Bearer ' with nothing!
    // Verify token with my secret
    // console.log(`Token is ${token}`);

    // Check JWT token
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

    // Check User schema and probeer een user te vinden
    const user = await User.findOne({
      _id: decoded._id,
      // Find a user with a correct auth token STILL stored
      'tokens.token': token,
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
    console.log(e);
    res.status(401).send({ error: 'Eerst inloggen' });
  }
};

// The Complete Node.js Developer Course (3rd Edition) - Andrew Mead

module.exports = auth;