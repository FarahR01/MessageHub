const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./Database/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const messageRoutes = require("./Routes/messageRoutes");
const socketIo = require("socket.io");
const http = require("http");
const socketHandler = require("./Utils/socket");
const { errorHandler } = require("./Middlewares/error");
const path = require("path");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
console.log('Socket.IO initialized');

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler middleware
app.use(errorHandler);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "Messaging API",
      description: "API for a basic messaging system",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/messages", messageRoutes);

// Serve static files
app.use(express.static("public"));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app, server, and io
module.exports = { app, server, io };
