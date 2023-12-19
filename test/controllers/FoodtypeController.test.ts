import { Request, Response } from 'express';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, beforeEach, jest} from '@jest/globals';
import CheckInput from "../../src/tools/CheckInput";
import { TRequest } from '../../src/controllers/types/types';
import FoodtypeService from "../../src/services/FoodtypeService";
import HttpStatus from '../../src/constants/HttpStatus';
import FoodtypeController from '../../src/controllers/FoodtypeController';
import AdminMiddleware from '../../src/middleware/AdminMiddleware';
import ImageContoller from '../../src/controllers/ImageContoller';
import { ObjectId } from 'mongodb';

jest.mock('../../src/services/FoodtypeService');
jest.mock('../../src/controllers/ImageContoller');
jest.mock('../../src/tools/CheckInput');

jest.mock('../../src/middleware/AdminMiddleware', () => ({
    adminLoginMiddleware: jest.fn( (req: TRequest, res: Response, next: any) => {
        req = Object.assign(req, { token: { _id: "64a685757acccfac3d045af3" } });
        next();
    }),
}));

describe('FoodtypeController', () => {
  describe('getAll', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
      req = {} as Request;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should return all food types', async () => {
      const expectedResult = ['food type 1', 'food type 2'];
      (FoodtypeService.queryAll as jest.Mock).mockResolvedValue(expectedResult as never);

      await FoodtypeController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    test('should return internal server error if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      (FoodtypeService.queryAll as jest.Mock).mockRejectedValue(new Error(errorMessage) as never);

      await FoodtypeController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});

// ------------------------------------------------------------

