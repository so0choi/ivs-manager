import { IvschatHelper } from "../helpers/ivschat.helper";
import { ERRORS } from "../helpers/errors.helper";
import { utils } from "../utils";

export class ChatService {
  async creatChatRoom(streamId: string) {
    try {
      const chatRoom = await IvschatHelper.createRoom(streamId);
      return {
        arn: chatRoom.arn,
        id: chatRoom.id,
      };
    } catch (error) {
      console.error(`Error in createChatRoom: ${error}`);
      throw ERRORS.internalServerError;
    }
  }

  async deleteChatRoom(chatRoomArn: string) {
    try {
      await IvschatHelper.deleteRoom(chatRoomArn);
    } catch (error) {
      console.error(`Error in createChatRoom: ${error}`);
      throw ERRORS.internalServerError;
    }
  }

  async createChatToken(chatArn: string, username: string) {
    try {
      const uuid = utils.uuidv4();
      const userId = `${username}.${uuid}`;
      const attributes = {
        username,
      };
      const { sessionExpirationTime, token, tokenExpirationTime } =
        await IvschatHelper.createChatToken(chatArn, userId, attributes);
      return {
        sessionExpirationTime,
        token,
        tokenExpirationTime,
      };
    } catch (error) {
      console.error(`Error in createChatRoom: ${error}`);
      throw ERRORS.internalServerError;
    }
  }
}
