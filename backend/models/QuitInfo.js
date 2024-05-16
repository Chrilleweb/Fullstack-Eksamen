const db = require("../config/dbConfig");

class QuitInfo {
  // Function to retrieve quit info by user ID
  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM quit_info WHERE user_id = ?";
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Function to create a new quit record
  static create(userId, quitDate, cigarettesPerDay) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO quit_info (user_id, quit_date, cigarettes_per_day) VALUES (?, ?, ?)";
      db.query(query, [userId, quitDate, cigarettesPerDay], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  // Function to update an existing quit record
  static update(userId, quitDate, cigarettesPerDay) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE quit_info SET quit_date = ?, cigarettes_per_day = ? WHERE user_id = ?";
      db.query(query, [quitDate, cigarettesPerDay, userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  // Function to delete a quit record
  static delete(userId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM quit_info WHERE user_id = ?";
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }
}

module.exports = QuitInfo;
