const { Server } = require("socket.io");
const ChatMessage = require("./models/ChatMessages");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type"],
    },
  });

  io.on("connection", (socket) => {

    // When a new client connects, send all previous messages
    ChatMessage.getAll()
      .then(messages => {
        socket.emit("previous messages", messages);
      })
      .catch(error => {
        console.error("Database read error:", error);
      });

    socket.on("chat message", (data) => {
      // Save new message to database
      ChatMessage.create(data.username, data.message)
        .then(messageId => {
          const messageData = {
            id: messageId,
            username: data.username,
            message: data.message,
            timestamp: new Date(),
          };
          // Emit the message to all clients
          io.emit("chat message", messageData);
        })
        .catch(error => {
          console.error("Database write error:", error);
        });
    });

  });

  return io;
}

module.exports = initializeSocket;



