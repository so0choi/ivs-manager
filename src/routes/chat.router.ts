import { FastifyInstance } from "fastify";
import * as controllers from "../controllers";

async function chatRouter(fastify: FastifyInstance) {
  fastify.post(
    "/create",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            chatRoomId: { type: "string" },
            username: { type: "string" },
          },
          required: ["chatRoomId", "username"],
        },
      },
      config: {
        description: "Create a new chat token",
      },
    },
    controllers.createToken,
  );
}

export default chatRouter;
