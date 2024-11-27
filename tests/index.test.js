const Server = require("../lib/server");
const ioc = require("socket.io-client");

describe("Index.js", () => {
  let server, serverSocket, clientSocket;

  const opts = {
    port: 3000,
  };

  beforeEach(async () => {
    server = new Server(opts);
    await server.start();
    clientSocket = ioc(`http://localhost:${opts.port}`);
    // await new Promise(setImmediate);
  });

  afterEach(() => {
    // io && io.close();
    clientSocket && clientSocket.disconnect();
    server && server.close();
  });

  it("should start the server", () => {
    const newServer = new Server({ port: 3001 });
    expect(newServer).toBeDefined();
  });

  it("should start the server with io", async () => {
    const newServer = new Server({ port: 3001 });
    newServer.start();
    // await new Promise(setImmediate);
    expect(newServer).toBeDefined();
    newServer.close();
  });

  test("should work with a message", (done) => {
    clientSocket.on("message", async (ack) => {
      serverSocket = await server.getIOServerSocket();
      expect(serverSocket.connected).toEqual(true);
      await serverSocket.disconnect();

      expect(serverSocket.connected).toEqual(false);
      expect(ack).toBe("Hello Socket");
      done();
    });

    clientSocket.emit("message", "Hello Socket");
  });

  test("should work with an acknowledgement", (done) => {
    clientSocket.emit("hi", async (arg) => {
      serverSocket = await server.getIOServerSocket();
      expect(serverSocket.connected).toEqual(true);
      await serverSocket.disconnect();

      expect(serverSocket.connected).toEqual(false);
      expect(arg).toBe("hola");
      done();
    });
  });
});
