import app from '../../app'
import supertest from 'supertest'
import { Response, NextFunction } from 'express';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';

import FoodTypeController from "../../src/controllers/FoodtypeController"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the FoodTypeController module
jest.mock('../../src/controllers/FoodTypeController', () => ({
    getAll: jest.fn((req, res : Response) => res.json()),
    addFoodtype: jest.fn((req, res : Response) => res.json()),
    deleteFoodtype: jest.fn((req, res : Response) => res.json()),
}));

describe('Test the /FoodType paths', () => {
    //GetAll test
    test('The / route should call the getAll function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/foodtype`);
        // Assert that UserController.login was called
        expect(FoodTypeController.getAll).toHaveBeenCalled();
    });

    //AddFoodType test
    test('The / route should call the addFoodType function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.post(`${base_url}/foodtype`);
        // Assert that UserController.login was called
        expect(FoodTypeController.addFoodtype).toHaveBeenCalled();
    });

    //DeleteFoodType test
    test('The / route should call the deleteFoodType function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.delete(`${base_url}/foodtype/1`);
        // Assert that UserController.login was called
        expect(FoodTypeController.deleteFoodtype).toHaveBeenCalled();
    });
});