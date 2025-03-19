import { FastifyReply, FastifyRequest } from "fastify";
import { STANDARD } from "../constants/request";
import { ChatService } from "../services/chat.service";
import { CreateChatTokenDto } from "../schemas/Chat";
import { handleServerError } from "../helpers/errors.helper";
import { utils } from "../utils";

const chatService = new ChatService();
export const createToken = async (
  request: FastifyRequest<{ Body: CreateChatTokenDto }>,
  reply: FastifyReply,
) => {
  try {
    const { chatRoomId, username } = request.body;
    const chatRoomArn = utils.createChatRoomArn(chatRoomId);
    const token = await chatService.createChatToken(chatRoomArn, username);
    return reply.code(STANDARD.OK.statusCode).send(token);
  } catch (error) {
    handleServerError(reply, error);
  }
};
