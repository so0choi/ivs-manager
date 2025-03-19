import { IVSHelper } from "../helpers/ivs.helper";
import { utils } from "../utils";
import { ERRORS } from "../helpers/errors.helper";
import { StreamRepository } from "../repositories/stream.repository";

export class StreamService {
  async createStream(title: string) {
    try {
      return await IVSHelper.createChannel(title);
    } catch (e) {
      throw new Error("Error in createStream: " + e.message);
    }
  }

  async getStreamById(streamId: string) {
    try {
      return await StreamRepository.getStream(streamId);
    } catch (e) {
      throw new Error("Error in getStreamById: " + e.message);
    }
  }

  async endStream(streamId: string) {
    try {
      const channelArn = utils.createChannelArn(streamId);
      await IVSHelper.stopStream(channelArn);
    } catch (e) {
      if (e.$metadata?.httpStatusCode) {
        const statusCode = e.$metadata.httpStatusCode;

        if (statusCode === 404) {
          throw ERRORS.streamNotExists;
        } else if (statusCode >= 500) {
          throw ERRORS.invalidRequest;
        }
      }

      throw new Error("Error in endStream: " + e.message);
    }
  }

  async deleteStream(streamId: string) {
    try {
      const channelArn = utils.createChannelArn(streamId);
      await IVSHelper.deleteChannel(channelArn);
    } catch (e) {
      // AWS SDK 에러 처리
      if (e.$metadata?.httpStatusCode) {
        const statusCode = e.$metadata.httpStatusCode;

        if (statusCode === 404) {
          throw ERRORS.streamNotExists;
        } else if (statusCode >= 500) {
          throw ERRORS.invalidRequest;
        }
      }
      throw new Error("Error in deleteStream: " + e.message);
    }
  }
}
