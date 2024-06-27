const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { sendMessage, receiveMessages, checkMessageStatus } = require('../Controllers/messageController');
const Message = require('../Models/Message');

jest.mock('../Models/Message');

const app = express();
app.use(bodyParser.json());

app.post('/api/messages/send', sendMessage);
app.get('/api/messages/receive/:userId', receiveMessages);
app.get('/api/messages/status/:messageId', checkMessageStatus);

describe('Message Controller without Database', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a new message', async () => {
    const mockMessage = {
      _id: '12345',
      sender: 'User1',
      receiver: 'User2',
      content: 'Hello, this is a test message',
      status: 'sent',
      timestamp: new Date(),
    };

    Message.prototype.save = jest.fn().mockResolvedValue(mockMessage);

    const res = await request(app)
      .post('/api/messages/send')
      .send({
        sender: 'User1',
        receiver: 'User2',
        content: 'Hello, this is a test message'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id', '12345');
    expect(res.body).toHaveProperty('sender', 'User1');
    expect(res.body).toHaveProperty('receiver', 'User2');
    expect(res.body).toHaveProperty('content', 'Hello, this is a test message');
  });

  it('should receive messages for a user', async () => {
    const mockMessages = [
      {
        _id: '12345',
        sender: 'User1',
        receiver: 'User2',
        content: 'Hello, this is a test message',
        status: 'sent',
        timestamp: new Date(),
      },
    ];

    Message.find = jest.fn().mockResolvedValue(mockMessages);

    const res = await request(app)
      .get('/api/messages/receive/User2');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('sender', 'User1');
  });

  it('should check message status', async () => {
    const mockMessage = {
      _id: '12345',
      sender: 'User1',
      receiver: 'User2',
      content: 'Hello, this is a test message',
      status: 'sent',
      timestamp: new Date(),
    };

    Message.findById = jest.fn().mockResolvedValue(mockMessage);

    const res = await request(app)
      .get(`/api/messages/status/12345`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'sent');
  });
});
