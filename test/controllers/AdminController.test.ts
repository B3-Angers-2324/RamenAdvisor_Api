import {describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest} from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import AdminService from '../../src/services/AdminService';
import AdminControler from '../../src/controllers/AdminController';

import dotenv from 'dotenv';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/AdminService');

describe('AdminController - login', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a token if the email and password are correct', async () => {
    const admin = {
      _id: 'adminId',
      password: 'password123',
    };
    const secret = process.env.JWT_SECRET_ADMIN || 'ASecretPhrase';
    const token = 'generatedToken';

    (AdminService.getOneUser as jest.Mock).mockResolvedValue(await (admin as unknown as Promise<never>));
    (jwt.sign as jest.Mock).mockReturnValue(token);

    await AdminControler.login(req, res);

    expect(AdminService.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: admin._id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ token });
  });

  test('should return an unauthorized status if the password is incorrect', async () => {
    const admin = {
      _id: 'adminId',
      password: 'wrongPassword',
    };

    (AdminService.getOneUser as jest.Mock).mockResolvedValue(admin as never);

    await AdminControler.login(req, res);

    expect(AdminService.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
  });

  test('should return a not found status if the user does not exist', async () => {
    (AdminService.getOneUser as jest.Mock).mockResolvedValue(null as never);

    await AdminControler.login(req, res);

    expect(AdminService.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return an internal server error status if an error occurs', async () => {
    (AdminService.getOneUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await AdminControler.login(req, res);

    expect(AdminService.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while logging in' });
  });
});