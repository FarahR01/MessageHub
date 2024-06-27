const express = require("express");
const {
  sendMessage,
  receiveMessages,
  checkMessageStatus,
} = require("../Controllers/messageController");
const router = express.Router();

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
router.post("/send", sendMessage);

/**
 * @swagger
 * /api/messages/receive/{userId}:
 *   get:
 *     summary: Receive messages for a user
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user receiving messages
 *     responses:
 *       200:
 *         description: List of messages
 *       404:
 *         description: User not found
 */
router.get("/receive/:userId", receiveMessages);

/**
 * @swagger
 * /api/messages/status/{messageId}:
 *   get:
 *     summary: Check message status
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the message
 *     responses:
 *       200:
 *         description: Message status
 *       404:
 *         description: Message not found
 */
router.get("/status/:messageId", checkMessageStatus);

module.exports = router;
