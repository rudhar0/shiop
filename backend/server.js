// backend/server.js - Updated Version
const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({
  path: "./config.env"
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to Database
connectDB();

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📡 API available at http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated!');
  });
});