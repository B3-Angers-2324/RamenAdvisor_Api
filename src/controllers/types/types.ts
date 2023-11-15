import { Request } from "express";

export interface TRequest extends Request {
    file?: {
        buffer: Buffer
        mimetype: string
    };
    token?: any;
}