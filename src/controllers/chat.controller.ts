import { FastifyReply, FastifyRequest } from "fastify";
import { STANDARD } from "../constants/request";
import { ChatService } from "../services/chat.service";
import { CreateChatTokenDto } from "../schemas/Chat";
import { handleServerError } from "../utils/errors.helper";
import { generalUtils } from "../utils/general.utils";

const chatService = new ChatService();
export const createToken = async (
  request: FastifyRequest<{ Body: CreateChatTokenDto }>,
  reply: FastifyReply,
) => {
  try {
    const { chatRoomId, username } = request.body;
    const chatRoomArn = generalUtils.createChatRoomArn(chatRoomId);
    const token = await chatService.createChatToken(chatRoomArn, username);
    return reply.code(STANDARD.OK.statusCode).send(token);
  } catch (error) {
    handleServerError(reply, error);
  }
};
