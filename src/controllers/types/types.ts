import { Request } from "express";

export interface TRequest extends Request {
    token?: any;
}

export class CustomError extends Error {
  public code: number;

  constructor(message?: string, code?: number ) {
    super(message);
    this.code = code || 500;
  }
}