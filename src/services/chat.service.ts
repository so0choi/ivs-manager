import { IvschatHelper } from "../utils/ivschat.helper";
import { ERRORS } from "../utils/errors.helper";
import { generalUtils } from "../utils/general.utils";

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
      const uuid = generalUtils.uuidv4();
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
