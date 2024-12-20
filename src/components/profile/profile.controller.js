module.exports = {
  getUserProfile: (req, res) => {
    console.log(req.user);
    res.render("pages/profile", {
      user: req.user,
    });
  },
};
