import { createServer } from 'http';
import { app } from './app';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

io.on('connection', (socket)=> {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined the room`);
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
  })
  
})

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
