import { FastifyReply } from 'fastify';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const ERRORS = {
    userExists: new AppError('User already exists', 409),
    streamNotExists: new AppError('Stream not exists', 404),
    tokenError: new AppError('Invalid Token', 401),
    invalidRequest: new AppError('Invalid Token', 400),
    internalServerError: new AppError('Internal Server Error', 500),
    unauthorizedAccess: new AppError('Unauthorized access', 401),
};

export function handleServerError(reply: FastifyReply, error: any) {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
    }

    return reply
        .status(ERRORS.internalServerError.statusCode)
        .send(ERRORS.internalServerError.message);
}
