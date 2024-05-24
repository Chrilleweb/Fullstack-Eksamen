const db = require("../config/dbConfig");

class ChatMessage {
  // Function to retrieve all chat messages
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM chat_messages ORDER BY timestamp ASC", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Function to save a new chat message
  static create(username, message) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO chat_messages (username, message) VALUES (?, ?)", [username, message], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }
}

module.exports = ChatMessage;