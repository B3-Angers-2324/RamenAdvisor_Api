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
            userId: new ObjectId('64a685757acccfac3d045aa2'),
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
        test('queryMessagesForRestaurant with valid restaurantId', async () => {
            const userCollection = await collectionInit.createUserCollection();
            collections.user = userCollection as unknown as Collection<Document>;

            const usersData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    firstName: 'test1',
                    lastName: 'test1',
                    birthDay: new Date('1999-01-01'),
                    email: 'user1@gmail.com',
                    phone: '0123456789',
                    sexe: 'homme',
                    password: 'test1',
                    ban: false,
                    ville: 'Angers',
                    address: 'test1',
                    image: 'urlImage1',
                },
                {
                    _id: new ObjectId('64a685757acccfac3d045aa2'),
                    firstName: 'test3',
                    lastName: 'test3',
                    birthDay: new Date('1999-01-01'),
                    email: 'user3@gmail.com',
                    phone: '0123456789',
                    sexe: 'femme',
                    password: 'test3',
                    ban: false,
                    ville: 'Angers',
                    address: 'test3',
                    image: 'urlImage3',
                },
            ];

            await db.addDatasToCollection(userCollection, usersData);

            await db.addDatasToCollection(messageCollection, validMessagesData);

            const result : any = await MessageService.queryMessagesForRestaurant("64a685757acccfac3d045aa1", 3, 0);
            expect(result).not.toBeNull();
            expect(result.length).toBe(3);
        });

        describe("Test if queryOne work correctely", () => {
            test('queryOne with valid messageId', async () => {
                await db.addDatasToCollection(messageCollection, validMessagesData);

                const result = await MessageService.queryOne("64a685757acccfac3d045aa1");
                expect(result).not.toBeNull();

                const result2 = await MessageService.queryOne("64a685757acccfac3d045aa6");
                expect(result2).toBeNull();
            });
        });

        describe("Test if deleteMessage work correctely", () => {
            test('deleteMessage with valid messageId', async () => {
                await db.addDatasToCollection(messageCollection, validMessagesData);

                //test if message exist
                const exist = await messageCollection.findOne({_id: new ObjectId('64a685757acccfac3d045aa1')});
                expect(exist).not.toBeNull();

                await MessageService.deleteMessage("64a685757acccfac3d045aa1");

                const result = await messageCollection.findOne({_id: new ObjectId('64a685757acccfac3d045aa1')});
                expect(result).toBeNull();
            });
        });

    });


    describe("Test addMessage function", () => {
        test('addMessage with valid message', async () => {
            const result = await MessageService.addMessage(validMessagesData[0]);
            expect(result).toBeDefined();
        });
    });

    describe("Test lasTimeUserSentMessage function", () => {
        test('lasTimeUserSentMessage with valid userId and restaurantId', async () => {
            await db.addDatasToCollection(messageCollection, validMessagesData);

            const result = await MessageService.lasTimeUserSentMessage("64a685757acccfac3d045aa1", "64a685757acccfac3d045aa1");
            expect(result).not.toBeNull();
        });
    });

    describe("Test deleteAllMessagesForUser function", () => {
        test('deleteAllMessagesForUser with valid userId', async () => {
            await db.addDatasToCollection(messageCollection, validMessagesData);

            //test if message exist
            const exist = await messageCollection.findOne({userId: new ObjectId('64a685757acccfac3d045aa1')});
            expect(exist).not.toBeNull();

            await MessageService.deleteAllMessagesForUser("64a685757acccfac3d045aa1");

            const result = await messageCollection.findOne({userId: new ObjectId('64a685757acccfac3d045aa1')});
            expect(result).toBeNull();
        });
    });

    describe("Test deleteAllMessagesForRestaurant function", () => {
        test('deleteAllMessagesForRestaurant with valid restaurantId', async () => {
            await db.addDatasToCollection(messageCollection, validMessagesData);

            //test if message exist
            const exist = await messageCollection.findOne({restaurantId: new ObjectId('64a685757acccfac3d045aa1')});
            expect(exist).not.toBeNull();

            await MessageService.deleteAllMessagesForRestaurant("64a685757acccfac3d045aa1");

            const result = await messageCollection.findOne({restaurantId: new ObjectId('64a685757acccfac3d045aa1')});
            expect(result).toBeNull();
        });
    });

    describe("Test queryMessagesForUser function", () => {
        test('queryMessagesForUser with valid userId', async () => {
            const restaurantCollection = await collectionInit.createRestaurantCollection();
            collections.restaurant = restaurantCollection as unknown as Collection<Document>;

            const restaurantData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    ownerId: new ObjectId('64a685757acccfac3d045aa1'),
                    name: 'test1',
                    position: [45, 45],
                    address: 'test1@gmail.com',
                    foodtype: 'test1',
                    note: 30,
                    images: ['urlImage1', 'urlImage2'],
                },
                {
                    _id: new ObjectId('64a685757acccfac3d045aa4'),
                    ownerId: new ObjectId('64a685757acccfac3d045aa4'),
                    name: 'test4',
                    position: [45, 45],
                    address: 'test4',
                    foodtype: 'test4',
                    note: 30,
                    images: ['urlImage4', 'urlImage5'],
                },
            ];

            await db.addDatasToCollection(restaurantCollection, restaurantData);
            await db.addDatasToCollection(messageCollection, validMessagesData);

            //test if message exist
            const result = await MessageService.queryMessagesForUser("64a685757acccfac3d045aa1", 3, 0);
            expect(result).not.toBeNull();
            expect((result as any).length).toBe(2);

            //test if message don't exist
            const result2 = await MessageService.queryMessagesForUser("64a685757acccfac3d045ab1", 3, 0);
            expect(result2).not.toBeNull();
            expect((result2 as any).length).toBe(0);
        });
    });
});