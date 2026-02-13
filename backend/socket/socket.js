export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Admin connected");

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  });
};
