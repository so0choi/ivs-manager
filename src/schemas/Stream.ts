import Joi from "joi";

export interface CreateStreamDto {
  title: string;
}
export interface UpdateStreamDto {
  streamId: string;
}

export interface DeleteStreamDto {
  streamId: string;
}
export interface GetStreamDto {
  streamId: string;
}

export const createStreamSchema = Joi.object({
  title: Joi.string().required(),
});
