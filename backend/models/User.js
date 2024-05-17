const db = require("../config/dbConfig");

class User {
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static findAllUsers() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static create(newUser) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO users SET ?", newUser, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({ id: results.insertId, ...newUser });
        }
      });
    });
  }

  static updateRole(userId, role) {
    return new Promise((resolve, reject) => {
      db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static deleteUser(userId) {
    return new Promise((resolve, reject) => {
      // First, delete related records in the quit_info table
      const deleteQuitInfoQuery = "DELETE FROM quit_info WHERE user_id = ?";
      db.query(deleteQuitInfoQuery, [userId], (quitInfoError) => {
        if (quitInfoError) {
          reject(quitInfoError);
        } else {
          // Then, delete the user from the users table
          const deleteUserQuery = "DELETE FROM users WHERE id = ?";
          db.query(deleteUserQuery, [userId], (userError, results) => {
            if (userError) {
              reject(userError);
            } else {
              resolve(results.affectedRows > 0);
            }
          });
        }
      });
    });
  }

  static saveResetToken(userId, token, expiration) {
    return new Promise((resolve, reject) => {
      db.query("UPDATE users SET resetToken = ?, resetTokenExpiration = ? WHERE id = ?", [token, expiration, userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  static findByResetToken(token) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiration > NOW()", [token], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static updatePassword(userId, hashedPassword) {
    return new Promise((resolve, reject) => {
      db.query("UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE id = ?", [hashedPassword, userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
}

module.exports = User;
