const Message = require('../Models/Message');
const catchAsyncErrors = require('../Middlewares/catchAsyncError');

const sendMessage = catchAsyncErrors(async (req, res) => {
  const { sender, receiver, content } = req.body;

  const newMessage = new Message({ sender, receiver, content });
  const savedMessage = await newMessage.save();
  res.status(201).json(savedMessage);
});

const receiveMessages = catchAsyncErrors(async (req, res) => {
  const { userId } = req.params;

  Message.find({ receiver: userId })
    .then((messages) => {
      messages.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).json(messages);
    })
    .catch((error) => {
      console.error('Erreur asynchrone interceptée:', error);
      next(error);
    });
});

const checkMessageStatus = catchAsyncErrors(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }
  res.status(200).json({ status: message.status });
});

module.exports = {
  sendMessage,
  receiveMessages,
  checkMessageStatus,
};