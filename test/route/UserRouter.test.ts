import app from '../../app'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
//import {register} from '../src/controllers/UserController';
import UserController from "../../src/controllers/UserController"
import UserMiddleware from "../../src/middleware/UserMiddleware"
import { NextFunction } from 'express';

const request = supertest(app);

const base_url = '/api/v1';

//Mock the UserMiddleware module
jest.mock('../../src/middleware/UserMiddleware', () => ({
    userLoginMiddleware: jest.fn((req, res : Response, next : NextFunction) => next())
}));


// Mock the UserController module
jest.mock('../../src/controllers/UserController', () => ({
    login: jest.fn((req, res : Response) => res.json()),
    register: jest.fn((req, res : Response) => res.json()),
    getAll: jest.fn((req, res : Response) => res.json()),
    getUserProfile: jest.fn((req, res : Response) => res.json()),
    updateUserProfile: jest.fn((req, res : Response) => res.json()),
    deleteUserProfile: jest.fn((req, res : Response) => res.json())
}));

describe('Test the /user paths', () => {
    //Login test
    test('The /login route should call the login function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.post(`${base_url}/user/login`);
        // Assert that UserController.login was called
        expect(UserController.login).toHaveBeenCalled();
    });

    test('The /register route should call the login function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.post(`${base_url}/user/register`)
        // Assert that UserController.login was called
        expect(UserController.register).toHaveBeenCalled();
    });
});