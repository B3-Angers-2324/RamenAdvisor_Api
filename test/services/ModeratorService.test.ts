import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import ModeratorService from '../../src/services/ModeratorService';

describe('Test all ModeratorService function', () => {
    let moderatorCollection: Collection<Document>;

    beforeAll(async () => {
        await db.connectMongoDB()
        moderatorCollection = await collectionInit.createModeratorCollection();
        collections.moderator = moderatorCollection as unknown as Collection<Document>;
    });

    afterEach(async () => {
        await db.clearMongoDB()
    });

    afterAll(async () => {
        await db.closeMongoDB()
    });

    describe('Test if getOneUser work correctely', () => {
        test('getOneUser of moderator with email', async () => {

            const modosData = [
                {
                email: 'modo1@gmail.com',
                password: 'test1',
                }
            ];

            await db.addDatasToCollection(moderatorCollection, modosData);

            // l'utilisateur existe
            const res = await ModeratorService.getOneUser('modo1@gmail.com');
            expect(res).not.toBeNull();

            // l'utilisateur n'existe pas
            const res2 = await ModeratorService.getOneUser('modo2@gmail.com');
            expect(res2).toBeNull();
        })
    })

    describe('Test if isRightToken work correctely', () => {
        test('isRightToken of moderator with id and token', async () => {
            const modosData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    email: 'modo1@gmail.com',
                    password: 'test1',
                    token: 'token1'
                }
            ];
            await db.addDatasToCollection(moderatorCollection, modosData);

            // there is a user with id and token
            const res = await ModeratorService.isRightToken('64a685757acccfac3d045aa1', 'token1');
            expect(res).not.toBeNull();

            // there is no user with id and token
            const res2 = await ModeratorService.isRightToken('64a685757acccfac3d045aa1', 'token2');
            expect(res2).toBeNull();

            // there is no user with id
            const res3 = await ModeratorService.isRightToken('64a685757acccfac3d045aa2', 'token1');
            expect(res3).toBeNull();

            // there is no user with token
            const res4 = await ModeratorService.isRightToken('64a685757acccfac3d045aa2', 'token3');
            expect(res4).toBeNull();
        })
    })

    describe('Test if updateToken work correctely', () => {
        test('updateToken of moderator with email and token', async () => {
            const modosData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    email: 'test1@gmail.com',
                    password: 'test1',
                }
            ];
            await db.addDatasToCollection(moderatorCollection, modosData);

            // add token
            const res = await ModeratorService.updateToken('test1@gmail.com', 'token1');

            // check if token is added
            const modo = await moderatorCollection.findOne({email: 'test1@gmail.com'});
            expect(modo?.token).toBe('token1');

            // update token
            const res2 = await ModeratorService.updateToken('test1@gmail.com', 'token2');

            // check if token is updated
            const modo2 = await moderatorCollection.findOne({email: 'test1@gmail.com'});
            expect(modo2?.token).toBe('token2');

        })
    })

})