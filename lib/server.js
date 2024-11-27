const express = require("express");
const path = require("path");

const SocketIO = require("./socket");

class Server {
  constructor(opts) {
    this.port = opts.port;
    this.app = express();
    this.server = null;
    this.io = null;
    this.IOServer = null;
    this.IOServerSocket = null;
  }

  async attach() {
    const IOServer = new SocketIO({ server: this._server });
    const io = await IOServer.start();
    const ioSocket = await IOServer.getSocket();

    this.IOServer = IOServer;
    this.io = io;
    this.IOServerSocket = ioSocket;

    console.log(`Server is running on port ${this.port}`);
  }

  getIO() {
    return this.io;
  }

  async getIOServerSocket() {
    return this.IOServer.socket;
  }

  async start() {
    this.app.get("/home", (req, res) => {
      res.static(path.join(__dirname, "../public/index.html"));
    });

    this.app.use(
      express.static(path.join(__dirname, "../coverage/lcov-report"))
    );

    this._server = this.app.listen(this.port, this.attach.bind(this));
  }

  close() {
    this._server.close();
  }
}

module.exports = Server;
