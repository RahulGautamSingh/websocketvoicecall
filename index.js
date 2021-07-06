const http = require("http").createServer();
const socket = require("socket.io");

const io = socket(http, {
  cors: { origin: "*" },
});

let onlineList = [];
io.on("connection", (socket) => {
  console.log("client connected", socket.id);
  socket.on("storeClientInfo", function (data) {
    var clientInfo = new Object();
    clientInfo.customId = data.customId;
    clientInfo.clientId = socket.id;
    if (!onlineList.includes(data.customId))
      onlineList.push({
        socketId: socket.id,
        name: data.customId,
        peerId: data.peerId,
      });

    io.emit("message", onlineList);
  });

  socket.on("disconnect", () => {
    onlineList = onlineList.filter((elem) => elem.socketId !== socket.id);

    io.emit("message", onlineList);
  });
});

const PORT = 3030;
http.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
