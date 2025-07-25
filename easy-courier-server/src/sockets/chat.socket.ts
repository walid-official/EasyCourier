// sockets/chat.socket.ts
import { Server, Socket } from 'socket.io';

interface JoinPayload {
  userId: string;
}

interface MessagePayload {
  senderId: string;
  receiverId: string;
  orderId: string;
  message: string;
}

const onlineUsers = new Map<string, string>();

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on('join', ({ userId }: JoinPayload) => {
    onlineUsers.set(userId, socket.id);
    console.log(`🟢 User ${userId} joined with socket ${socket.id}`);
  });

  socket.on('send_message', (payload: MessagePayload) => {
    const { receiverId } = payload;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', payload);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`🔴 User ${userId} disconnected`);
        break;
      }
    }
  });
};
