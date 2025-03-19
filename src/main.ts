import fastify from "fastify";
import chatRouter from "./routes/chat.router";
import streamRouter from "./routes/stream.router";
import loadConfig from "./config/env.config";
import formbody from "@fastify/formbody";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);

const startServer = async () => {
  const server = fastify({
    logger: { level: process.env.LOG_LEVEL },
  });

  // Register middlewares
  server.register(formbody);
  server.register(cors);
  server.register(helmet);

  // Register routes
  server.register(chatRouter, { prefix: "/chat" });
  server.register(streamRouter, { prefix: "/stream" });

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    reply.status(error.statusCode || 500).send({ error: error.message });
  });

  // Root route
  server.get("/", (request, reply) => {
    reply.status(200).send({ message: "Hello from ivs-live-manager" });
  });

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  // Start server
  try {
    await server.listen({
      port,
      host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
