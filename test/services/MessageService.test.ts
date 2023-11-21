import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import MessageService from '../../src/services/MessageService';

describe('Test all MessageService function', () => {
    let messageCollection: Collection<Document>;

    beforeAll(async () => {
        await db.connectMongoDB()
        messageCollection = await collectionInit.createMessageCollection();
        collections.message = messageCollection as unknown as Collection<Document>;
    });

    afterEach(async () => {
        await db.clearMongoDB()
    });

    afterAll(async () => {
        await db.closeMongoDB()
    });

    const validMessagesData = [
        {
            _id: new ObjectId('64a685757acccfac3d045aa1'),
            userId: new ObjectId('64a685757acccfac3d045aa1'),
            restaurantId: new ObjectId('64a685757acccfac3d045aa1'),
            message: "Message 1",
            date: new Date(),
            note: 30,
        },
        {
            _id: new ObjectId('64a685757acccfac3d045aa2'),
            userId: new ObjectId('64a685757acccfac3d045aa2'),
            restaurantId: new ObjectId('64a685757acccfac3d045aa1'),
            message: "Message 2",
            date: new Date(),
            note: 50,
        },
        {
            _id: new ObjectId('64a685757acccfac3d045aa3'),
            userId: new ObjectId('64a685757acccfac3d045aa3'),
            restaurantId: new ObjectId('64a685757acccfac3d045aa1'),
            message: "Message 3",
            date: new Date(),
            note: 40,
        },
        {
            _id: new ObjectId('64a685757acccfac3d045aa4'),
            userId: new ObjectId('64a685757acccfac3d045aa1'),
            restaurantId: new ObjectId('64a685757acccfac3d045aa4'),
            message: "Message 4",
            date: new Date(),
            note: 30,
        },
        {
            _id: new ObjectId('64a685757acccfac3d045aa5'),
            userId: new ObjectId('64a685757acccfac3d045aa2'),
            restaurantId: new ObjectId('64a685757acccfac3d045aa4'),
            message: "Message 5",
            date: new Date(),
            note: 50,
        }
    ]

    describe("Test if queryMessagesForRestaurant work correctely", () => {
        // test('queryMessagesForRestaurant with valid restaurantId', async () => {
        //     await db.addDatasToCollection(messageCollection, validMessagesData);

        //     //console log le nombre de message dans la collection
        //     const messages = await messageCollection.find({}).toArray();
        //     console.log("Nombre de message dans la collection : " + messages.length);

        //     // le restaurant existe
        //     const result : any = await MessageService.queryMessagesForRestaurant("64a685757acccfac3d045aa4", 10, 0);
        //     console.log(result.length);
        //     expect(result).not.toBeNull();
        //     expect(result.length).toBe(2);
        // });
    });

    test("1+1=2", () => {
        expect(1+1).toBe(2);
    })
});