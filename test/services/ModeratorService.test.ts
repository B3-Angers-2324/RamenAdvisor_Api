import app from '../../app'
import * as db from '../utils/dbHandler'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document } from 'mongodb';
import mongoose from 'mongoose';

import ModeratorService from '../../src/services/ModeratorService';

const request = supertest(app)

describe('Test all ModeratorService function', () => {
    const moderatorCollection = mongoose.connection.collection('moderators');
    collections.moderator = moderatorCollection as unknown as Collection<Document>;

    beforeAll(async () => {
        await db.connect()
    });

    afterEach(async () => {
        await db.clearDatabase()
    });

    afterAll(async () => {
        await db.closeDatabase()
    });

    describe("Test 1+1=2 juste for waiting real function", () => {
        test("1+1=2", () => {
            expect(1+1).toBe(2);
        })
    })

})