import path from "path";
import Joi from "joi";
import dotenv from "dotenv";

export default function loadConfig(): void {
  const envPath = path.join(__dirname, "..", "..", ".env");

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    throw new Error(
      `Failed to load .env file from path ${envPath}: ${result.error.message}`,
    );
  }

  const schema = Joi.object({
    NODE_ENV: Joi.string()
      .valid("development", "testing", "production")
      .required(),
    AWS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    DYNAMODB_STREAM_TABLE: Joi.string().required(),
    AWS_IVS_CHANNEL_ARN_BASE_URL: Joi.string().required(),
    AWS_IVS_CHAT_ARN_BASE_URL: Joi.string().required(),
  }).unknown(true);

  const { error } = schema.validate(process.env, { abortEarly: false });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
}
