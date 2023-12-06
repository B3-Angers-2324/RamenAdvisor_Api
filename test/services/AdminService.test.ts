import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import AdminService from '../../src/services/AdminService';

describe('Test all AdminService function', () => {
    let adminCollection: Collection<Document>;

    beforeAll(async () => {
        await db.connectMongoDB()
        adminCollection = await collectionInit.createAdminCollection();
        collections.admin = adminCollection as unknown as Collection<Document>;
    });

    afterEach(async () => {
        await db.clearMongoDB()
    });

    afterAll(async () => {
        await db.closeMongoDB()
    });

    describe('Test if getOneUser work correctely', () => {
        test('getOneUser of admin with email', async () => {

            const adminsData = [
                {
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

    describe('Test if isRightToken work correctely', () => {
        test('isRightToken of admin with id and token', async () => {
            const adminsData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    email: 'admin1@gmail.com',
                    password: 'test1',
                    token: 'token1'
                }
            ];
            await db.addDatasToCollection(adminCollection, adminsData);

            // there is a user with id and token
            const res = await AdminService.isRightToken('64a685757acccfac3d045aa1', 'token1');
            expect(res).not.toBeNull();

            // there is no user with id and token
            const res2 = await AdminService.isRightToken('64a685757acccfac3d045aa1', 'token2');
            expect(res2).toBeNull();

            // there is no user with id
            const res3 = await AdminService.isRightToken('64a685757acccfac3d045aa2', 'token1');
            expect(res3).toBeNull();

            // there is no user with token
            const res4 = await AdminService.isRightToken('64a685757acccfac3d045aa2', 'token3');
            expect(res4).toBeNull();
        })
    })

    describe('Test if updateToken work correctely', () => {
        test('updateToken of admin with email and token', async () => {
            const adminsData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    email: 'test1@gmail.com',
                    password: 'test1',
                }
            ];
            await db.addDatasToCollection(adminCollection, adminsData);

            // add token
            const res = await AdminService.updateToken('test1@gmail.com', 'token1');

            // check if token is added
            const admin = await adminCollection.findOne({email: 'test1@gmail.com'});
            expect(admin?.token).toBe('token1');

            // update token
            const res2 = await AdminService.updateToken('test1@gmail.com', 'token2');

            // check if token is updated
            const admin2 = await adminCollection.findOne({email: 'test1@gmail.com'});
            expect(admin2?.token).toBe('token2');

        })
    })
})