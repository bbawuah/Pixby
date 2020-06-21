// require("dotenv").config();
const express = require('express')

const search = new express.Router()


const User = require('../models/users')

// search for interests
search.get('/search:term', async (req, res) => {
  console.log(req.params)
  await User.find({ profession: { $regex: new RegExp(req.params.term.replace(':', '')) } }, (err, data) => {
    res.send(data)
  })
})


module.exports = search
