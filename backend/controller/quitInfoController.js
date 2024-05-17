const QuitInfo = require("../models/QuitInfo");

const getQuitInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const quitInfo = await QuitInfo.getByUserId(userId);
    if (quitInfo.length > 0) {
      res.status(200).json(quitInfo[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

const addQuitInfo = async (req, res) => {
  const { userId, quit_date, cigarettes_per_day } = req.body;
  try {
    const newQuitInfoId = await QuitInfo.create(userId, quit_date, cigarettes_per_day);
    res.status(201).json({ id: newQuitInfoId, message: "Quit info added successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

const updateQuitInfo = async (req, res) => {
  const { userId } = req.params;
  const { quit_date, cigarettes_per_day } = req.body;
  try {
    const result = await QuitInfo.update(userId, quit_date, cigarettes_per_day);
    if (result > 0) {
      res.status(200).json({ message: "Quit info updated successfully" });
    } else {
      res.status(404).json({ message: "Quit info not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

module.exports = {
  getQuitInfo,
  addQuitInfo,
  updateQuitInfo,
};
