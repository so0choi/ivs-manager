import {
    ChannelLatencyMode, ChannelType,
    CreateChannelCommand, CreateStreamKeyCommand, DeleteChannelCommand,
    GetChannelCommand, GetStreamCommand, GetStreamKeyCommand,
    IvsClient,
    ListStreamsCommand, StopStreamCommand
} from "@aws-sdk/client-ivs";

let ivsClient: IvsClient | null = null;

export function getIVSClient() {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error("AWS credentials are missing!");
    }

    if (ivsClient) return ivsClient;
    ivsClient = new IvsClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
    return ivsClient;
}

export class IVSHelper {
    /**
     * IVS 채널 생성
     * @param name 채널 이름
     * @returns 생성된 채널 정보
     */
    static async createChannel(name: string) {
        const params = {
            name,
            type: ChannelType.StandardChannelType, // BASIC 또는 STANDARD
            latencyMode: ChannelLatencyMode.LowLatency, // LOW 또는 NORMAL
            recordingConfigurationArn: "", // 녹화 설정 (없으면 빈 문자열)
        };

        const command = new CreateChannelCommand(params);
        return getIVSClient().send(command);
    }

    /**
     * 특정 채널 정보 조회
     * @param channelArn 채널 ARN
     * @returns 채널 정보
     */
    static async getChannel(channelArn: string) {
        const command = new GetChannelCommand({ arn: channelArn });
        const response = await getIVSClient().send(command);
        return response;
    }

    /**
     * 스트림 키 조회
     * @param streamKeyArn 스트림 키 ARN
     * @returns 스트림 키 정보
     */
    static async getStreamKey(streamKeyArn: string) {
        const command = new GetStreamKeyCommand({ arn: streamKeyArn });
        const response = await getIVSClient().send(command);
        return response;
    }

    /**
     * 현재 스트림 정보 조회 (방송 상태 확인)
     * @param channelArn 채널 ARN
     * @returns 현재 스트림 상태
     */
    static async getStream(channelArn: string) {
        const command = new GetStreamCommand({ channelArn });
        return  getIVSClient().send(command);
    }

    /**
     * 방송 종료 (stopStream)
     * @param channelArn 채널 ARN
     * @returns 방송 종료 결과
     */
    static async stopStream(channelArn: string) {
        const command = new StopStreamCommand({ channelArn });
        return getIVSClient().send(command);
    }


    /**
     * 스트림 삭제 (deleteChannel)
     * @param channelArn 채널 ARN
     * @returns 스트림 삭제 결과
     */
    static async deleteChannel(channelArn: string) {
        const command = new DeleteChannelCommand({ arn: channelArn });
        return getIVSClient().send(command)
    }
}
