import app from '../../app'
import supertest from 'supertest'
import { Response, NextFunction } from 'express';
import {describe, expect, test, jest} from '@jest/globals';
import OwnerController from "../../src/controllers/OwnerController"
import OwnerMiddleware from "../../src/middleware/OwnerMiddleware"

const request = supertest(app);

const base_url = '/api/v1';

//Mock the OwnerMiddleware module
jest.mock('../../src/middleware/OwnerMiddleware', () => ({
    ownerLoginMiddleware: jest.fn((req, res : Response, next : NextFunction) => next())
}));

// Mock the UserController module
jest.mock('../../src/controllers/OwnerController', () => ({
    login: jest.fn((req, res : Response) => res.json()),
    register: jest.fn((req, res : Response) => res.json()),
    getRestaurantsByOwner: jest.fn((req, res : Response) => res.json()),
    getOwnerProfile: jest.fn((req, res : Response) => res.json()),
    updateOwnerProfile: jest.fn((req, res : Response) => res.json()),
    deleteOwnerProfile: jest.fn((req, res : Response) => res.json()),
}));

describe('Test the /owner paths', () => {
    //Login test
    test('The /login route with a post should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.post(`${base_url}/owner/login`);
        // Assert that UserController.login was called
        expect(OwnerController.login).toHaveBeenCalled();
    });
    test('The /register route with a post should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.post(`${base_url}/owner/register`);
        // Assert that UserController.login was called
        expect(OwnerController.register).toHaveBeenCalled();
    });
    test('The /restaurants route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.get(`${base_url}/owner/restaurants`);
        // Assert that UserController.login was called
        expect(OwnerController.getRestaurantsByOwner).toHaveBeenCalled();
        expect(OwnerMiddleware.ownerLoginMiddleware).toHaveBeenCalled();
    });
});