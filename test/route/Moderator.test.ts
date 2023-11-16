import app from '../../app'
import supertest from 'supertest'
import { Response, NextFunction } from 'express';
import {describe, expect, test, jest} from '@jest/globals';
import ModeratorController from "../../src/controllers/ModeratorController"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the UserController module
jest.mock('../../src/controllers/ModeratorController', () => ({
    defaultFunction: jest.fn((req, res : Response) => res.json()),
}));

describe('Test the /moderator paths', () => {
    //Login test
    test('The / route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.get(`${base_url}/moderator/`);
        // Assert that UserController.login was called
        expect(ModeratorController.defaultFunction).toHaveBeenCalled();
    });
});