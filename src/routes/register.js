const express = require("express");
// Laad Express in
const register = new express.Router(); // Create nieuwe instance of register

const sharp = require("sharp"); // Package for resizing images
const multer = require("multer");

const auth = require("../authenticate/auth");
// Mongoose models
const User = require("../models/users");

const upload = multer({ dest: "static/uploads/" });

// Api route waarmee ik een nieuwe user aanmaak
register.post(
  "/user",
  upload.fields([{ name: "baby-img" }, { name: "old-image" }]),
  async (req, res) => {
    let babyPhoto = "";
    let oldPhoto = "";

    const rawImages = Object.values(req.files);
    console.log(rawImages);

    for (let i = 0; i < rawImages.length; i++) {
      babyPhoto = rawImages[0][0].filename;
      oldPhoto = rawImages[1][0].filename;

    }
  

    const data = {
      ...req.body,
      img: babyPhoto,
      imgOld: oldPhoto
    }

    console.log(data);

    const user = new User(data); // Create new user with data
    const token = await user.generateAuthToken(); // Dit is dus een custom method op mijn mongoose middleware. Zie model/users.js

    try {
      await user.save(); // Save user in database
      console.log({ user, token });

      res.status(201).send({ user, token }); // Stuur object van user en token terug
    } catch (e) {
      console.log(e);
      res.status(400).send(e); // If something goes wrong, send an error back to client
    }
  }
);

register.get("/users/me", auth, async (req, res) => {
  res.send(req.user); // Zie auth function
});

// LOGIN register
register.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    ); // finding a user by email with matching password
    console.log(user); // Printing out the user
    const token = await user.generateAuthToken(); // Generating an authentication token for the login session

    //   res.cookie('jwt', token, { httpOnly: true, domain:process.env.COOKIE_DOMAIN });
    res.send({ user, token }); // Sending back the user with the token
  } catch (e) {
    console.log(e.message); // Consoling the error
    res.status(400).send({ error: e.message }); //  Sending back the error to the user
  }
});

register.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token // Filter out the matching token
    );
    await req.user.save(); // Save the user
    res.send({ msg: "Logged out!" }); // Sending back the user
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = register;
