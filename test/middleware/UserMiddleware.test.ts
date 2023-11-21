import {describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest} from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import UserMiddleware from '../../src/middleware/UserMiddleware';

describe('userLoginMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next() if a valid token is provided', () => {
    const token = 'validToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_USER || 'ASecretPhrase';
    const decode = { userId: '123' };
    jest.spyOn(jwt, 'verify').mockImplementation(() => decode);

    UserMiddleware.userLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect((req as any).token).toEqual(decode);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED status and error message if no token is provided', () => {
    UserMiddleware.userLoginMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to view this page' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED status and error message if token verification fails', () => {
    const token = 'invalidToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_USER || 'ASecretPhrase';
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    UserMiddleware.userLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to view this page' });
    expect(next).not.toHaveBeenCalled();
  });
});