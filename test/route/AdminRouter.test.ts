import app from '../../app'
import supertest from 'supertest'
import { Response, NextFunction } from 'express';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
import AdminController from "../../src/controllers/AdminController"
import AdminMiddleware from '../../src/middleware/AdminMiddleware';

const request = supertest(app);

const base_url = '/api/v1';

//Mock the AdminMiddleware module
jest.mock('../../src/middleware/AdminMiddleware', () => ({
    adminLoginMiddleware: jest.fn((req, res : Response, next : NextFunction) => next())
}));

// Mock the UserController module
jest.mock('../../src/controllers/AdminController', () => ({
    login: jest.fn((req, res : Response) => res.json()),
    nav: jest.fn((req, res : Response) => res.json()),
    getUsers: jest.fn((req, res : Response) => res.json()),
    getUserProfile: jest.fn((req, res : Response) => res.json()),
    getUserMessage: jest.fn((req, res : Response) => res.json()),
    banUser: jest.fn((req, res : Response) => res.json()),

    getModerators: jest.fn((req, res : Response) => res.json()),
    addModerator: jest.fn((req, res : Response) => res.json()),
    deleteModerator: jest.fn((req, res : Response) => res.json())
}));

describe('Test the /Admin paths', () => {
    //Login test
    test('The /login route should call the login function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.post(`${base_url}/admin/login`);
        // Assert that UserController.login was called
        expect(AdminController.login).toHaveBeenCalled();
    });

    //Nav test
    test('The /nav route should call the nav function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/admin/nav`);
        // Assert that UserController.login was called
        expect(AdminController.nav).toHaveBeenCalled();
    });

    //GetUsers test
    test('The /search/user route should call the getUsers function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/admin/search/user`);
        // Assert that UserController.login was called
        expect(AdminController.getUsers).toHaveBeenCalled();
    });

    //GetUserProfile test
    test('The /user/profile/:uid route should call the getUserProfile function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/admin/user/profile/1`);
        // Assert that UserController.login was called
        expect(AdminController.getUserProfile).toHaveBeenCalled();
    });

    //GetUserMessage test
    test('The /user/message/:uid route should call the getUserMessage function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/admin/user/message/1`);
        // Assert that UserController.login was called
        expect(AdminController.getUserMessage).toHaveBeenCalled();
    });

    //BanUser test
    test('The /user/ban/:uid route should call the banUser function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.patch(`${base_url}/admin/user/ban/1`);
        // Assert that UserController.login was called
        expect(AdminController.banUser).toHaveBeenCalled();
    });


    //GetModerators test
    test('The /moderator route should call the getModerators function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.get(`${base_url}/admin/moderator`);
        // Assert that UserController.login was called
        expect(AdminController.getModerators).toHaveBeenCalled();
    });

    //AddModerator test
    test('The /moderator route should call the addModerator function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.post(`${base_url}/admin/moderator`);
        // Assert that UserController.login was called
        expect(AdminController.addModerator).toHaveBeenCalled();
    });

    //DeleteModerator test
    test('The /moderator route should call the deleteModerator function on the controller', async () => {
        // Make a POST request to the /user/login endpoint
        const response = await request.delete(`${base_url}/admin/moderator/1`);
        // Assert that UserController.login was called
        expect(AdminController.deleteModerator).toHaveBeenCalled();
    });
});