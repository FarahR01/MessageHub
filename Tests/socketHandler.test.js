const io = require('socket.io-client');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const Message = require('../Models/Message');
const socketHandler = require('../Utils/socket');

jest.mock('../Models/Message');

describe('Socket Handler', () => {
  let server, ioServer, clientSocket;

  beforeAll((done) => {
    const app = express();
    server = http.createServer(app);
    ioServer = socketIo(server);
    ioServer.on('connection', (socket) => {
      socketHandler(socket, ioServer);
    });
    server.listen(() => {
      const port = server.address().port;
      clientSocket = io(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    ioServer.close();
    clientSocket.close();
    server.close();
  });

  it('should handle sendMessage and broadcast the message', (done) => {
    const mockMessage = {
      _id: '12345',
      sender: 'User1',
      receiver: 'User2',
      content: 'Hello, this is a test message',
      status: 'sent',
      timestamp: new Date(),
    };

    Message.prototype.save = jest.fn().mockResolvedValue(mockMessage);

    clientSocket.emit('sendMessage', {
      sender: 'User1',
      receiver: 'User2',
      content: 'Hello, this is a test message'
    });

    clientSocket.on('message', (message) => {
      try {
        expect(message).toHaveProperty('_id', '12345');
        expect(message).toHaveProperty('sender', 'User1');
        expect(message).toHaveProperty('receiver', 'User2');
        expect(message).toHaveProperty('content', 'Hello, this is a test message');
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
