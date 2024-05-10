const home_get = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  home_get,
};
