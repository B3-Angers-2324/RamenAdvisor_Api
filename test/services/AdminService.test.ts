import app from '../../app'
import * as db from '../utils/dbHandler'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document } from 'mongodb';
import mongoose from 'mongoose';

import AdminService from '../../src/services/AdminService';

const request = supertest(app)

describe('Test all AdminService function', () => {
    const adminCollection = mongoose.connection.collection('admins');
    collections.admin = adminCollection as unknown as Collection<Document>;

    beforeAll(async () => {
        await db.connect()
    });

    afterEach(async () => {
        await db.clearDatabase()
    });

    afterAll(async () => {
        await db.closeDatabase()
    });

    describe('Test if getOneUser work correctely', () => {
        test('getOneUser of admin with email', async () => {

            const adminsData = [
                {
                firstName: 'test1',
                lastName: 'test1',
                email: 'admin1@gmail.com',
                password: 'test1',
                }
            ];

            await db.addDatasToCollection(adminCollection, adminsData);

            // l'utilisateur existe
            const res = await AdminService.getOneUser('admin1@gmail.com');
            expect(res).not.toBeNull();

            // l'utilisateur n'existe pas
            const res2 = await AdminService.getOneUser('admin2@gmail.com');
            expect(res2).toBeNull();
        })
    })
})