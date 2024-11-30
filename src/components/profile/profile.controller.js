module.exports = {
  getUserProfile: (req, res) => {
   
    res.render("pages/profile", {
      user: req.user,
    });
  }

}
  