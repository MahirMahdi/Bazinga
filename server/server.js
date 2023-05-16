const app = require("./app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

//array of active users
let activeUsers = [];

//establishing socket connection
io.on("connection", async (socket) => {
  //add new user
  socket.once("addNewUser", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    //get active users
    io.emit("getUsers", activeUsers);

    //join room using conversation id or other user's socket id
    socket.on("join-room", (roomId) => {
      socket.rooms.forEach((room) => {
        if (room != roomId) {
          socket.join(roomId);
        }
      });
    });

    //get user Id
    socket.on("sendUserId", (id) => {
      const socketId = activeUsers.filter(
        (activeUser) => activeUser.userId == id
      )[0]?.socketId;
      io.emit("getSocketId", socketId);
    });

    //triggers everytime a conversation is updated
    socket.on("updateConversation", (data) => {
      io.to(data).emit("conversationUpdated", data);
    });

    socket.once("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getUsers", activeUsers);
    });
  });

  //remove user from the active users array
  socket.on("removeUser", (userId) => {
    activeUsers = activeUsers.filter((user) => user.userId !== userId);
    io.emit("getUsers", activeUsers);

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getUsers", activeUsers);
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
