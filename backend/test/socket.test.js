const io = require("socket.io-client");
const http = require("http");
const app = require("../app");
const initializeSocket = require("../socket");

let httpServer;
let ioServer;
let clientSocket;

beforeAll((done) => {
  httpServer = http.createServer(app);
  httpServer.listen(() => {
    const port = httpServer.address().port;
    ioServer = initializeSocket(httpServer);
    clientSocket = io(`http://localhost:${port}`);
    clientSocket.on("connect", done);
  });
});

afterAll(() => {
  if (ioServer) ioServer.close();
  if (clientSocket) clientSocket.close();
  if (httpServer) httpServer.close();
});

test("should communicate", (done) => {
  const messageData = { username: "testUser", message: "Hello World" };

  // Emit a chat message on client to test server response
  clientSocket.emit("chat message", messageData);

  // Listen for messages echoed back by the server
  clientSocket.once("chat message", (data) => {
    expect(data.message).toBe("Hello World");
    expect(data.username).toBe("testUser");
    done();
  });
});

test("should handle multiple clients", (done) => {
  const clientSocket2 = io(`http://localhost:${httpServer.address().port}`);
  let messagesReceived = 0;

  function handleMessage(data) {
    try {
      expect(data.message).toBe("Hello from client 1");
      messagesReceived++;
      if (messagesReceived === 2) { // Make sure both clients receive the message
        clientSocket.off("chat message", handleMessage); // Remove listener to avoid memory leaks
        clientSocket2.close();
        done();
      }
    } catch (error) {
      done(error);
    }
  }

  clientSocket2.on("connect", () => {
    // Emit a chat message on client to test server response
    const messageData = { username: "testUser", message: "Hello from client 1" };
    clientSocket.emit("chat message", messageData);
    clientSocket.on("chat message", handleMessage);
    clientSocket2.on("chat message", handleMessage);
  });
});
