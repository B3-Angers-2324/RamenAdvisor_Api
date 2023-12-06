import {describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest} from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import OwnerMiddleware from '../../src/middleware/OwnerMiddleware';
import OwnerService from '../../src/services/OwnerService';

describe('ownerLoginMiddleware', () => {
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

  test('should call next() if a valid token is provided', async () => {
    const token = 'validToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_OWNER || 'ASecretPhrase';
    const decode = { userId: '123' };
    jest.spyOn(jwt, 'verify').mockImplementation(() => decode);
    jest.spyOn(OwnerService, 'isRightToken').mockResolvedValue(true);
    jest.spyOn(OwnerService, 'isBan').mockResolvedValue(false);

    await OwnerMiddleware.ownerLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect((req as any).token).toEqual(decode);
    expect(OwnerService.isRightToken).toHaveBeenCalled();
    expect(OwnerService.isBan).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED status and error message if no token is provided', async () => {
    await OwnerMiddleware.ownerLoginMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to view this page' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED status and error message if token verification fails', async () => {
    const token = 'invalidToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_OWNER || 'ASecretPhrase';
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await OwnerMiddleware.ownerLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to view this page' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED if the owner is banned', async () => {
    const token = 'validToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_OWNER || 'ASecretPhrase';
    const decode = { userId: '123' };
    jest.spyOn(jwt, 'verify').mockImplementation(() => decode);
    jest.spyOn(OwnerService, 'isRightToken').mockResolvedValue(true);
    jest.spyOn(OwnerService, 'isBan').mockResolvedValue(true);

    await OwnerMiddleware.ownerLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect((req as any).token).toEqual(decode);
    expect(OwnerService.isRightToken).toHaveBeenCalled();
    expect(OwnerService.isBan).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to view this page' });
    expect(next).not.toHaveBeenCalled();
  });
});