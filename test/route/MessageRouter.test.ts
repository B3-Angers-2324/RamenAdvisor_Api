import app from '../../app'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
import MessageController from "../../src/controllers/MessageController"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the UserController module
jest.mock('../../src/controllers/MessageController', () => ({
    getMessagesForRestaurant: jest.fn((req, res : Response) => res.json()),
    reportMessage: jest.fn((req, res : Response) => res.json()),
    getReportedMessages: jest.fn((req, res : Response) => res.json()),
    deleteReport: jest.fn((req, res : Response) => res.json()),
}));

describe('Test the /restaurant paths', () => {
    //Login test
    test('The /message/restaurant/:uid route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.get(`${base_url}/message/restaurant/:uid`);
        // Assert that UserController.login was called
        expect(MessageController.getMessagesForRestaurant).toHaveBeenCalled();
    });
    test('The /message/report/:uid route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.put(`${base_url}/message/report/:uid`);
        // Assert that UserController.login was called
        expect(MessageController.reportMessage).toHaveBeenCalled();
    });
    test('The /message/reported route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.get(`${base_url}/message/reported`);
        // Assert that UserController.login was called
        expect(MessageController.getReportedMessages).toHaveBeenCalled();
    });
    test('The /message/report/:uid route with a delete should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.delete(`${base_url}/message/report/:uid`);
        // Assert that UserController.login was called
        expect(MessageController.deleteReport).toHaveBeenCalled();
    });
});