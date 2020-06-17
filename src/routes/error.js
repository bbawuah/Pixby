function error(req, res) {
  res.status(404).render("error");
}

module.exports = error;