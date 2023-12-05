import app from '../../app'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
//import {register} from '../src/controllers/UserController';
import AdminController from "../../src/controllers/AdminController"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the UserController module
jest.mock('../../src/controllers/AdminController', () => ({
    login: jest.fn((req, res : Response) => res.json()),
    getUsers: jest.fn((req, res : Response) => res.json()),
    getUserProfile: jest.fn((req, res : Response) => res.json()),
    getUserMessage: jest.fn((req, res : Response) => res.json()),
    banUser: jest.fn((req, res : Response) => res.json()),
}));

describe('Test the /Admin paths', () => {
    //Login test
    test('The /login route should call the login function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.post(`${base_url}/admin/login`);
        // Assert that UserController.login was called
        expect(AdminController.login).toHaveBeenCalled();
    });
});