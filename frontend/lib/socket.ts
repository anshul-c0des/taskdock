import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
  }

  return socket;
}

export function connectSocket(userId: string) {
  const socket = getSocket();
  if (!socket.connected) {
    socket.on("connect", () => {
      socket.emit("join", userId);
    });
  } else {
    socket.emit("join", userId);
  }
}
