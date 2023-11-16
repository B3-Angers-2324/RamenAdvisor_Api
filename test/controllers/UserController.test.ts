import { Request, Response } from 'express';
import UserController from '../../src/controllers/UserController';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';

describe('UserController', () => {
    /* Login */
    describe('login with empty body', () => {
        it('should return a http response with 400 bad request', async () => {
        // Arrange
        const req = {
            body: {
                //empty body
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await UserController.login(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('login with fake user', () => {
        it('should return a http response with 404 not found', async () => {
        // Arrange
        const req = {
            body: {
                email: 'test',
                password: 'test'
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await UserController.login(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        });
    });

});
