const socketIo = require("socket.io");

class SocketIO {
  constructor(opts) {
    this.expressServer = opts.server;
    this.socket = null;
  }

  async getSocket() {
    return this.socket;
  }

  async start() {
    const ioServer = socketIo(this.expressServer);
    ioServer.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("message", (msg) => {
        ioServer.emit("message", msg);
      });

      socket.on("hi", (cb) => {
        cb("hola");
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });

      this.socket = socket;
    });
    return ioServer;
  }
}

module.exports = SocketIO;
