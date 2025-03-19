import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateStreamDto,
  DeleteStreamDto,
  GetStreamDto,
  UpdateStreamDto,
} from "../schemas/Stream";
import { STANDARD } from "../constants/request";
import { StreamService } from "../services/stream.service";
import { ERRORS, handleServerError } from "../utils/errors.helper";
import { ChatService } from "../services/chat.service";
import { StreamRepository } from "../repositories/stream.repository";
import { generalUtils } from "../utils/general.utils";
import pino from "pino";

const streamService = new StreamService();
const chatService = new ChatService();
export const createStream = async (
  request: FastifyRequest<{ Body: CreateStreamDto }>,
  reply: FastifyReply,
) => {
  const { title } = request.body;
  let streamId: string;
  try {
    const { channel, streamKey } = await streamService.createStream(title);

    streamId = generalUtils.extractChannelId(channel.arn);

    const chat = await chatService.creatChatRoom(streamId);

    await StreamRepository.saveStream({
      streamId,
      channelArn: channel.arn,
      chatRoomArn: chat.arn,
      chatRoomId: chat.id,
    });

    return reply.code(STANDARD.CREATED.statusCode).send({
      stream: {
        title,
        streamId,
        streamKey: streamKey.value,
        playbackUrl: channel.playbackUrl,
        rtmpUrl: generalUtils.createRtmpURl(channel.ingestEndpoint),
      },
      chat,
    });
  } catch (err) {
    if (streamId) {
      pino().error("Rolling back: Deleting created IVS stream", streamId);
      await streamService.deleteStream(streamId);
    }

    return reply
      .code(500)
      .send({ error: "Failed to create stream and chat room" });
  }
};

export const getStream = async (
  request: FastifyRequest<{ Params: GetStreamDto }>,
  reply: FastifyReply,
) => {
  try {
    const { streamId } = request.params;
    const stream = await streamService.getStreamById(streamId);
    if (!stream) {
      return handleServerError(reply, ERRORS.streamNotExists);
    }
    return reply.code(STANDARD.OK.statusCode).send({
      streamId: stream.PK.split("_").pop(),
      status: stream.status,
      chatRoomId: stream.chatRoomId,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const deleteStream = async (
  request: FastifyRequest<{ Params: DeleteStreamDto }>,
  reply: FastifyReply,
) => {
  try {
    const { streamId } = request.params;
    await streamService.deleteStream(streamId);
    const { chatRoomArn } = await StreamRepository.getChatRoom(streamId);
    await chatService.deleteChatRoom(chatRoomArn);
    return reply.code(STANDARD.NO_CONTENT.statusCode).send();
  } catch (error) {
    handleServerError(reply, error);
  }
};

export const stopStream = async (
  request: FastifyRequest<{ Params: UpdateStreamDto }>,
  reply: FastifyReply,
) => {
  try {
    const { streamId } = request.params;
    await streamService.endStream(streamId);
    return reply.code(STANDARD.OK.statusCode).send();
  } catch (error) {
    handleServerError(reply, error);
  }
};
