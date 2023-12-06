import { Request } from "express";

export interface TRequest extends Request {
    token?: any;
    admin?: boolean;
}

export class CustomError extends Error {
  public code: number;

  constructor(message?: string, code?: number ) {
    super(message);
    this.code = code || 500;
  }
}