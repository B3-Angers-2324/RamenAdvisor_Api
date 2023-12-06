import { describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import AdminMiddleware from '../../src/middleware/AdminMiddleware';
import ModeratorService from '../../src/services/ModeratorService';
import AdminService from '../../src/services/AdminService';

describe('AdminMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call next() if moderator token is valid', async () => {
    const token = 'validToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_MODO || 'ASecretPhrase';
    const decode = { userId: '123' };
    jest.spyOn(jwt, 'verify').mockImplementation(() => decode);
    jest.spyOn(ModeratorService, 'isRightToken').mockResolvedValue(true);

    await AdminMiddleware.adminLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect((req as any).token).toEqual(decode);
    expect((req as any).admin).toBe(false);
    expect(ModeratorService.isRightToken).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('should call next() if admin token is valid', async () => {
    const token = 'valid_admin_token';
    const decodedToken = { _id: 'admin_id' };
    const isRightTokenMock = jest.spyOn(AdminService, 'isRightToken').mockResolvedValue(true);
    const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken as any);

    req.headers = { authorization: `Bearer ${token}` };

    await AdminMiddleware.adminLoginMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledWith(token, process.env.JWT_SECRET_ADMIN || 'ASecretPhrase');
    expect((req as any).token).toEqual(decodedToken);
    expect((req as any).admin).toBe(true);
    expect(isRightTokenMock).toHaveBeenCalledWith(decodedToken._id, token);
    expect(next).toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED status if no token provided', async () => {
    req.headers = {};

    const jsonMock = jest.fn();
    (res as any).status = jest.fn().mockReturnValue({ json: jsonMock });

    await AdminMiddleware.adminLoginMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'You are not authorized to view this page' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED status and error message if token verification fails', async () => {
    const token = 'invalidToken';
    req.headers = { authorization: `Bearer ${token}` };

    const secret = process.env.JWT_SECRET_ADMIN || 'ASecretPhrase';
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const jsonMock = jest.fn();
    (res as any).status = jest.fn().mockReturnValue({ json: jsonMock });

    await AdminMiddleware.adminLoginMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(jsonMock).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('should throw an error if wrong moderator token provided', async () => {
    const token = 'invalid_moderator_token';
    const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue({} as any);
    const isRightTokenMock = jest.spyOn(ModeratorService, 'isRightToken').mockResolvedValue(false);

    req.headers = { authorization: `Bearer ${token}` };

    const jsonMock = jest.fn();
    (res as any).status = jest.fn().mockReturnValue({ json: jsonMock });

    await AdminMiddleware.adminLoginMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledWith(token, process.env.JWT_SECRET_MODO || 'ASecretPhrase');
    expect(isRightTokenMock).toHaveBeenCalledWith(undefined, token);
    expect(next).not.toHaveBeenCalled();
  });

  test('should throw an error if wrong admin token provided', async () => {
    const token = 'invalid_admin_token';
    const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue({} as any);
    const isRightTokenMock = jest.spyOn(AdminService, 'isRightToken').mockResolvedValue(false);

    req.headers = { authorization: `Bearer ${token}` };

    const jsonMock = jest.fn();
    (res as any).status = jest.fn().mockReturnValue({ json: jsonMock });

    await AdminMiddleware.adminLoginMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledWith(token, process.env.JWT_SECRET_ADMIN || 'ASecretPhrase');
    expect(isRightTokenMock).toHaveBeenCalledWith(undefined, token);
    expect(next).not.toHaveBeenCalled();
  });
});