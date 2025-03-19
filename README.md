### **🚀 IVS Stream & Chat Room 매니징 프로세스 - README**

---

## **📌 프로젝트 개요**
이 프로젝트는 **AWS IVS(Interactive Video Service) Stream과 IVS Chat Room을 관리**하는 Fastify 기반의 API 서비스입니다.  
**DynamoDB를 사용하여 스트림과 채팅방 데이터를 저장**하고, Fastify를 이용해 CRUD API를 제공합니다.

---

## **📌 기술 스택**
- **Framework**: [Fastify](https://www.fastify.io/) 🚀
- **Database**: [AWS DynamoDB](https://aws.amazon.com/dynamodb/) 🛢️
- **Cloud Service**: [AWS IVS](https://aws.amazon.com/ivs/) 📺
- **Logging**: Pino 로거 📝

---

## **📌 프로젝트 구조**
```
src/
├── config/                # 환경 설정 및 설정값 관리
│   └── env.config.ts      # 환경 변수 설정 (AWS 설정 등)
├── constants/             # 상수 값 관리 (DynamoDB 키 값 등)
│   ├── dynamodb.ts        # DynamoDB 관련 상수
│   ├── request.ts         # API 요청 관련 상수
├── controllers/           # Fastify 컨트롤러 (API 엔드포인트)
│   ├── chat.controller.ts  # 채팅 관련 API
│   ├── index.ts           # 컨트롤러 모음
│   └── stream.controller.ts # 스트림 관련 API
├── main.ts                # Fastify 서버 실행
├── repositories/          # 데이터베이스 관련 레이어
│   └── stream.repository.ts # IVS Stream 관련 DynamoDB 연동
├── routes/                # Fastify 라우트 설정
│   ├── chat.router.ts     # 채팅 관련 API 라우트
│   ├── index.ts           # 라우트 모음
│   └── stream.router.ts   # 스트림 관련 API 라우트
├── schemas/               # 데이터 모델 (DynamoDB 테이블 구조)
│   ├── Chat.ts            # 채팅 테이블 모델
│   └── Stream.ts          # 스트림 테이블 모델
├── services/              # 비즈니스 로직
│   ├── chat.service.ts    # 채팅 관련 서비스 로직
│   └── stream.service.ts  # 스트림 관련 서비스 로직
├── utils/                 # 유틸리티 함수 모음
│   ├── dynamo.util.ts     # DynamoDB 관련 유틸 함수
│   ├── errors.util.ts     # 에러 핸들링 관련 함수
│   ├── general.util.ts    # 공통 유틸 함수
│   ├── ivs.util.ts        # IVS 관련 유틸 함수
│   ├── ivschat.util.ts    # IVS Chat 관련 유틸 함수
│   └── validation.util.ts # 데이터 검증 유틸 함수
├── main.ts                # 서버 실행
├── package.json       
└── README.md            
```

---

## **📌 설치 및 실행 방법**

### **1️⃣ 환경 변수 설정 (.env)**
`.env` 파일을 프로젝트 루트에 생성하고, 다음과 같이 AWS 자격 증명 및 IVS 설정을 추가합니다.

```plaintext
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-northeast-2
AWS_IVS_CHANNEL_ARN=arn:aws:ivs:ap-northeast-2:123456789012:channel/xyz123
DYNAMODB_TABLE_NAME=IVSStreams
```

### **2️⃣ 패키지 설치**
```bash
yarn install
```

### **3️⃣ Fastify 서버 실행**
```bash
yarn run dev
```

---

## **📌 API 엔드포인트**

### **✅ 1. IVS Stream 생성**
- **Endpoint**: `POST /stream`
- **설명**: IVS 스트림 및 관련 채팅방을 생성하고, 정보를 DynamoDB에 저장합니다.
- **Request Body**:
  ```json
  {
    "title": "My Live Stream"
  }
  ```
- **Response**:
  ```json
  {
    "stream": {
      "title": "My Live Stream",
      "streamId": "xyz123",
      "streamKey": "abc-xyz-123",
      "playbackUrl": "https://xyz.playback.live-video.net",
      "rtmpUrl": "rtmps://xyz.global-contribute.live-video.net:443/app/"
    },
    "chat": {
      "chatRoomId": "chat_456",
      "chatRoomArn": "arn:aws:ivschat:ap-northeast-2:123456789012:room/chat_456"
    }
  }
  ```

---

### **✅ 2. IVS Stream 조회**
- **Endpoint**: `GET /stream/:streamId`
- **설명**: 특정 IVS 스트림과 관련된 정보를 조회합니다.
- **Response**:
  ```json
  {
    "streamId": "xyz123",
    "channelArn": "arn:aws:ivs:ap-northeast-2:123456789012:channel/xyz123",
    "chatRoomId": "chat_456",
    "chatRoomArn": "arn:aws:ivschat:ap-northeast-2:123456789012:room/chat_456"
  }
  ```

---

### **✅ 3. IVS Stream 중지(Stop)**
- **Endpoint**: `POST /stream/:streamId/stop`
- **설명**: 특정 스트림을 중지합니다.
- **Response**:
  ```json
  {
    "message": "Stream stopped successfully"
  }
  ```

---

### **✅ 4. IVS Stream 삭제**
- **Endpoint**: `DELETE /stream/:streamId`
- **설명**: IVS 스트림과 관련된 채팅방을 삭제합니다.
- **Response**:
  ```json
  {
    "message": "Stream and chat room deleted successfully"
  }
  ```

---

## **📌 DynamoDB 테이블 구조**

| Partition Key (`PK`) | Sort Key (`SK`) | Attribute |
|------------------|--------------|----------------|
| `stream_xyz123` | `METADATA`   | `channelArn, status, chatRoomId` |
| `stream_xyz123` | `CHAT_ROOM`  | `chatRoomArn, createdAt` |

📌 **설명**:
- **IVS 스트림 정보**는 `PK = streamId`, `SK = "METADATA"`
- **IVS 채팅방 정보**는 `PK = streamId`, `SK = "CHAT_ROOM"`

---

## **📌 라이선스 & 기여**
- 이 프로젝트는 MIT 라이선스를 따릅니다.
- 개선점이 있다면 Pull Request를 환영합니다! 🚀
