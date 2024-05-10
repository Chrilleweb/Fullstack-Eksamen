const User = require("../models/User");

const admin_get = (req, res) => {
  res.status(200).json(req.user);
};

const getAllUsers = async (req, res) => {
  const users = await User.findAllUsers();
  const sortedUsers = users.sort((a, b) => {
    if (a.role === b.role) {
      return a.username.localeCompare(b.username);
    }
    return a.role.localeCompare(b.role);
  });
  const usersNameEmailAndRole = sortedUsers.map((user) => {
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  });
  res.status(200).json(usersNameEmailAndRole);
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await User.updateRole(id, role);
  if (result) {
    res.status(200).json({ message: "Role updated successfully" });
  } else {
    res.status(500).json({ message: "An error occurred" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await User.deleteUser(id);
  if (result) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  admin_get,
  getAllUsers,
  updateRole,
  deleteUser,
};