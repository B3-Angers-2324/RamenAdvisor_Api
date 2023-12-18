import app from '../../app'
import supertest from 'supertest'
import { Response, NextFunction } from 'express';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';

import ImageController from "../../src/controllers/ImageContoller"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the ImageController module
jest.mock('../../src/controllers/ImageContoller', () => ({
    getImage: jest.fn((req, res : Response) => res.json()),
}));

describe('Test the /Image paths', () => {
    //GetImage test
    test('The /get route should call the getImage function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/image/1`);
        // Assert that UserController.login was called
        expect(ImageController.getImage).toHaveBeenCalled();
    });

    //Options test
    test('The /options route should call the getImage function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.options(`${base_url}/image/1`);
        // Assert that UserController.login was called
        expect(ImageController.getImage).toHaveBeenCalled();
    });
});