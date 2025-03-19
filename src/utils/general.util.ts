import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";

export const utils = {
  isJSON: (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  },

  getTime: (): number => {
    return new Date().getTime();
  },

  preValidation: (schema: Joi.ObjectSchema) => {
    return (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void,
    ) => {
      const { error } = schema.validate(request.body);
      if (error) {
        return done(error);
      }
      done();
    };
  },
  extractChannelId(channelArn: string): string {
    return channelArn.split("/").pop() || "";
  },
  createChannelArn(channelId: string): string {
    return `${process.env.AWS_IVS_CHANNEL_ARN_BASE_URL}/${channelId}`;
  },
  createRtmpURl(endpoint: string) {
    return `rtmps://${endpoint}:443/app/`;
  },
  createChatRoomArn(chatRoomId: string) {
    return `${process.env.AWS_IVS_CHAT_ARN_BASE_URL}/${chatRoomId}`;
  },
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        // eslint-disable-next-line
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  },
};
