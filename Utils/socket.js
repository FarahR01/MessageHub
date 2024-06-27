const Message = require('../Models/Message');

const socketHandler = (socket, io) => {
  console.log('New client connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    console.log('Received message on server:', data);
    const { sender, receiver, content } = data;
    const newMessage = new Message({ sender, receiver, content });
    try {
      const savedMessage = await newMessage.save();
      console.log('Message saved to database:', savedMessage);
      io.emit('message', savedMessage);
      console.log('Message broadcast to all clients');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
};

module.exports = socketHandler;