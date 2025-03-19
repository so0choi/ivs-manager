import { FastifyInstance } from "fastify";
import { generalUtils } from "../utils/general.utils";
import { createStreamSchema } from "../schemas/Stream";
import * as controllers from "../controllers";

async function streamRouter(fastify: FastifyInstance) {
  fastify.post(
    "/create",
    {
      schema: {
        body: {
          type: "object",
          required: ["title"],
          properties: {
            streamKey: { type: "string" },
          },
        },
      },
      config: {
        description: "Create a new stream",
      },
      preValidation: generalUtils.preValidation(createStreamSchema),
    },
    controllers.createStream,
  );

  fastify.delete(
    "/:streamId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            streamId: { type: "string" },
          },
        },
      },
      config: {
        description: "Delete a stream",
      },
    },
    controllers.deleteStream,
  );

  fastify.get(
    "/:streamId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            streamId: { type: "string" },
          },
        },
      },
      config: {
        description: "Get a stream",
      },
    },
    controllers.getStream,
  );

  fastify.post(
    "/:streamId/stop",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            streamId: { type: "string" },
          },
        },
      },
      config: {
        description: "Stop a stream",
      },
    },
    controllers.stopStream,
  );
}

export default streamRouter;
