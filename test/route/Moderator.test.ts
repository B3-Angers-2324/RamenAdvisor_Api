import app from '../../app'
import supertest from 'supertest'
import { Response, NextFunction } from 'express';
import {describe, expect, test, jest} from '@jest/globals';
import ModeratorController from "../../src/controllers/ModeratorController"

const request = supertest(app);

const base_url = '/api/v1';

// Mock the UserController module
jest.mock('../../src/controllers/ModeratorController', () => ({
    
}));

describe('Test the /moderator paths', () => {
    // fill test 1+1
    test(1+1, () => {
        expect(1+1).toBe(2);
    });
});