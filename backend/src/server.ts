import { createServer } from "http";
import { app } from "./app";
import { initSocket } from "./lib/socket";

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

export const io = initSocket(httpServer);

io.on("connection", (socket) => {   // io init
  console.log(`User connected: ${socket.id}`);   // logs socket id

  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined the room`);   // loget user id in room
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);   // logs user disconnect
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
