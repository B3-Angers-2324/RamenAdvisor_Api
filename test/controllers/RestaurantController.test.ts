import { Request, Response } from 'express';
import RestaurantController from '../../src/controllers/RestaurantController';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
import RestaurantService from '../../src/services/RestaurantService';

// Mock the UserController module
jest.mock('../../src/services/RestaurantService', () => ({
    queryBestRestaurants: jest.fn( (limit: number) => { return [{_id: "test", name: "test", foodtype: "test", note: 5, position: "test", images: ["test"]}] }),
}));

describe('RestaurantController', () => {
    describe('Get the best restaurant with result in the db', () => {
        it('Should return a 200', async () => {
            // Arrange
            const req = {
                query: {
                    limit: 1
                }
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await RestaurantController.getBestRestaurants(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
