import { Request } from "express";

export interface TRequest extends Request {
    token?: any;
}