import { describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import AdminService from '../../src/services/AdminService';
import AdminControler from '../../src/controllers/AdminController';
import ModeratorService from '../../src/services/ModeratorService';

import dotenv from 'dotenv';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/AdminService');

describe('AdminController', () => {
  describe('login', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
      req = {} as Request;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should login as a moderator', async () => {
      const moderator = { password: 'moderatorPassword' };
      const token = 'moderatorToken';
      const secret_moderator = process.env.JWT_SECRET_MODO || "ASecretPhrase";

      req.body = {
        email: 'moderator@example.com',
        password: 'moderatorPassword',
      };

      jest.spyOn(ModeratorService, 'getOneUser').mockResolvedValueOnce(moderator);
      jest.spyOn(jwt, 'sign').mockReturnValueOnce(token as any);
      jest.spyOn(ModeratorService, 'updateToken').mockResolvedValueOnce(true);

      await AdminControler.login(req, res);

      expect(ModeratorService.getOneUser).toHaveBeenCalledWith('moderator@example.com');
      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: undefined, moderator: true },
        secret_moderator,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      expect(ModeratorService.updateToken).toHaveBeenCalledWith('moderator@example.com', token);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: token });
    });

    test('should return unauthorized for wrong moderator password', async () => {
      const moderator = { password: 'moderatorPassword' };

      req.body = {
        email: 'moderator@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(ModeratorService, 'getOneUser').mockResolvedValueOnce(moderator);

      await AdminControler.login(req, res);

      expect(ModeratorService.getOneUser).toHaveBeenCalledWith('moderator@example.com');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
    });

    test('should login as an admin', async () => {
      const admin = { password: 'adminPassword' };
      const token = 'adminToken';
      const secret_admin = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";

      req.body = {
        email: 'admin@example.com',
        password: 'adminPassword',
      };

      jest.spyOn(ModeratorService, 'getOneUser').mockResolvedValueOnce(null);
      jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(admin);
      jest.spyOn(jwt, 'sign').mockReturnValueOnce(token as any);
      jest.spyOn(AdminService, 'updateToken').mockResolvedValueOnce(true);

      await AdminControler.login(req, res);

      expect(ModeratorService.getOneUser).toHaveBeenCalledWith('admin@example.com');
      expect(AdminService.getOneUser).toHaveBeenCalledWith('admin@example.com');
      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: undefined, moderator: true },
        secret_admin,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      expect(AdminService.updateToken).toHaveBeenCalledWith('admin@example.com', token);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ token: token, ad: true });
    });

    test('should return unauthorized for wrong admin password', async () => {
      const admin = { password: 'adminPassword' };

      req.body = {
        email: 'admin@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(ModeratorService, 'getOneUser').mockResolvedValueOnce(null);
      jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(admin);

      await AdminControler.login(req, res);

      expect(ModeratorService.getOneUser).toHaveBeenCalledWith('admin@example.com');
      expect(AdminService.getOneUser).toHaveBeenCalledWith('admin@example.com');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
    });

    test('should return user not found', async () => {
      req.body = {
        email: 'unknown@example.com',
        password: 'password',
      };

      jest.spyOn(ModeratorService, 'getOneUser').mockResolvedValueOnce(null);
      jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(null);

      await AdminControler.login(req, res);

      expect(ModeratorService.getOneUser).toHaveBeenCalledWith('unknown@example.com');
      expect(AdminService.getOneUser).toHaveBeenCalledWith('unknown@example.com');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('should handle internal server error', async () => {
      req.body = {
        email: 'admin@example.com',
        password: 'adminPassword',
      };

      jest.spyOn(ModeratorService, 'getOneUser').mockRejectedValueOnce(new Error('Database error'));

      await AdminControler.login(req, res);

      expect(ModeratorService.getOneUser).toHaveBeenCalledWith('admin@example.com');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error while logging in' });
    });
  });
});