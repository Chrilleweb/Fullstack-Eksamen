const User = require("../models/User");

const home_get = (req, res) => {
  res.status(200).json(req.user);
};

const delete_user = (req, res) => {
  const user = req.user;
  User.deleteUser(user.userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  home_get,
  delete_user,
};
