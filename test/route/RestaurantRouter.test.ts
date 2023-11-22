import app from '../../app'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
import RestaurantController from "../../src/controllers/RestaurantController"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the UserController module
jest.mock('../../src/controllers/RestaurantController', () => ({
    getBestRestaurants: jest.fn((req, res : Response) => res.json()),
    getRestaurantById: jest.fn((req, res : Response) => res.json()),
    createRestaurant: jest.fn((req, res : Response) => res.json()),
    updateRestaurant: jest.fn((req, res : Response) => res.json())
}));

describe('Test the /restaurant paths', () => {
    test('The /best route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.get(`${base_url}/restaurant/best`);
        // Assert that UserController.login was called
        expect(RestaurantController.getBestRestaurants).toHaveBeenCalled();
    });
    test('The /id/:uid route with a get should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.get(`${base_url}/restaurant/id/123`);
        // Assert that UserController.login was called
        expect(RestaurantController.getRestaurantById).toHaveBeenCalled();
    });
    test('The / route should with a post call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.post(`${base_url}/restaurant`);
        // Assert that UserController.login was called
        expect(RestaurantController.createRestaurant).toHaveBeenCalled();
    });
    test('The /id/:uid route with a put should call the function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        await request.put(`${base_url}/restaurant/id/123`);
        // Assert that UserController.login was called
        expect(RestaurantController.updateRestaurant).toHaveBeenCalled();
    });
});