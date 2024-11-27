const Server = require("./lib/server");
const app = new Server({ port: 3000 });
app.start();
