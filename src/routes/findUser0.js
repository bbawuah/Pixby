function userID(req, res) {
  //SAVE ID FROM ROUTE INTO PROFILEID VARIABLE
  let userID = req.params.id;

  //SEARCH DATABASE FOR PROFILE WITH THIS ID
  User.findOne(
    {
      _id: mongo.ObjectID(userID)
    },
    userIDFound //RUN FUNCTION WHEN USER FOUND
  );

  function userIDFound(err, foundUser) {
    console.log(foundUser);
    if (err) {
      res.redirect("/notFound");
    } else {
      try {
        res.render("profile.hbs", {
          userPage: foundUser
        });
      } catch (error) {
        console.log(error);
        res.redirect("/notFound");
      }
    }
  }
}
