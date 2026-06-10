export function setupCoachingSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join:room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('chat:message', async (data) => {
      const { roomId, message, userId } = data;
      // Broadcast to room
      socket.to(roomId).emit('chat:update', {
        message,
        userId,
        timestamp: new Date()
      });
    });

    socket.on('action:update', (data) => {
      const { roomId, actionId, completed } = data;
      socket.to(roomId).emit('action:updated', { actionId, completed });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}