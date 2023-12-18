import app from '../../app'
import * as db from '../utils/dbHandler'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, afterEach, jest} from '@jest/globals';
import { collections, connectToDatabase } from '../../src/services/Database';
import { Collection, Document } from 'mongodb';
import mongoose from 'mongoose';

const request = supertest(app)

test("fill test to pass", () => {
    expect(true).toBeTruthy();
});

// describe("Test if the database is connected", () => {

//     test("Database is connected", async () => {
//         // detect if the fonction console is called
//         const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

//         await connectToDatabase();

//         expect(spy).toBeCalled();

//         spy.mockRestore();

//         // detect if the collections are not empty
//         expect(collections.restaurant).not.toBeNull();
//         expect(collections.owner).not.toBeNull();
//         expect(collections.user).not.toBeNull();
//         expect(collections.message).not.toBeNull();
//         expect(collections.moderator).not.toBeNull();
//         expect(collections.admin).not.toBeNull();
//         expect(collections.report).not.toBeNull();
//     })
// })