import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import RestaurantService from '../../src/services/RestaurantService';

describe('Test all RestaurantService function', () => {
    let restaurantCollection: Collection<Document>;

    beforeAll(async () => {
        await db.connectMongoDB()
        restaurantCollection = await collectionInit.createRestaurantCollection();
        collections.restaurant = restaurantCollection as unknown as Collection<Document>;
    });

    afterEach(async () => {
        await db.clearMongoDB()
    });

    afterAll(async () => {
        await db.closeMongoDB()
    });

    let validRestaurantsData = [
        {
            _id: new ObjectId('64a685757acccfac3d045ad9'),
            ownerId: new ObjectId('64a685757acccfac3d045ad9'),
            name: "Restaurant 1",
            description: "Description 1",
            position: [49, 52],
            address: "Address 1",
            foodtype: "local_food",
            note: 30,
            images: ["image1", "image2"],
        },
        {
            _id: new ObjectId('64a685757acccfac3d045ae9'),
            ownerId: new ObjectId('64a685757acccfac3d045ae9'),
            name: "Restaurant 2",
            description: "Description 2",
            position: [49, 52],
            address: "Address 2",
            foodtype: "local_food",
            note: 50,
            images: ["image1", "image2"],
        },
        {
            _id: new ObjectId('64a685757acccfac3d045af9'),
            ownerId: new ObjectId('64a685757acccfac3d045af9'),
            name: "Restaurant 3",
            description: "Description 3",
            position: [49, 52],
            address: "Address 3",
            foodtype: "local_food",
            note: 40,
            images: ["image1", "image2"],
        },
        {
            _id: new ObjectId('64a685757acccfac3d045af8'),
            ownerId: new ObjectId('64a685757acccfac3d045af8'),
            name: "Restaurant 4",
            description: "Description 4",
            position: [49, 52],
            address: "Address 4",
            foodtype: "local_food",
            note: 20,
            images: ["image1", "image2"],
        },
        {
            _id: new ObjectId('64a685757acccfac3d045af7'),
            ownerId: new ObjectId('64a685757acccfac3d045af7'),
            name: "Restaurant 5",
            description: "Description 5",
            position: [49, 52],
            address: "Address 5",
            foodtype: "local_food",
            note: 10,
            images: ["image1", "image2"],
        },
    ]

    describe("Test if queryBestRestaurants work correctely", () => {
        test('queryBestRestaurants with valid data', async () => {
            await db.addDatasToCollection(restaurantCollection, validRestaurantsData);

            // Call the queryBestRestaurants function
            const result = await RestaurantService.queryBestRestaurants(3);

            // Assert that the result has the correct length
            expect(result.length).toBe(3);

            // Assert that the restaurants are sorted in descending order of note
            expect(result[0].note).toBeGreaterThan(result[1].note);
        });
    });

    describe("Test if queryRestaurantById work correctely", () => {
        test('queryRestaurantById with valid data', async () => {
            await db.addDatasToCollection(restaurantCollection, validRestaurantsData);

            // Call the queryRestaurantsByOwner function
            const result = await RestaurantService.queryRestaurantById('64a685757acccfac3d045ad9');
            
            // Assert that the result is the expected one
            expect(result).toEqual(validRestaurantsData[0]);
        });
    })

    describe("Test if queryRestaurantsByOwner work correctely", () => {
        test('queryRestaurantsByOwner with valid data', async () => {
            await db.addDatasToCollection(restaurantCollection, validRestaurantsData);

            // Call the queryRestaurantsByOwner function
            const result = await RestaurantService.queryRestaurantsByOwner('64a685757acccfac3d045af9');
            
            // Assert that the result has the correct length
            expect(result.length).toBe(1);

            // Assert that the result is the expected one
            expect(result[0]).toEqual(validRestaurantsData[2]);
        });
    });

    describe("Test if createRestaurant work correctely", () => {
        test('createRestaurant with valid data', async () => {
            const validRestaurantData = {
                ownerId: new ObjectId('64a685757acccfac3d045ad9'),
                name: "Restaurant 1",
                description: "Description 1",
                position: [49, 52],
                address: "Address 1",
                foodtype: "local_food",
                note: 30,
                images: ["image1", "image2"],
            };

            // Call the createRestaurant function
            const result = await RestaurantService.createRestaurant(validRestaurantData);
            
            const restaurant = await restaurantCollection.findOne({_id: result.insertedId});

            // Assert that the result is the expected one
            expect(restaurant).toEqual(validRestaurantData);
        });
    });

    describe("Test if updateRestaurant work correctely", () => {
        test('updateRestaurant with valid data', async () => {

            await db.addDatasToCollection(restaurantCollection, [validRestaurantsData[0]]);

            const restaurant : any = await restaurantCollection.findOne({_id: new ObjectId("64a685757acccfac3d045ad9")});

            const updateValue = {
                ownerId: new ObjectId('64a685757acccfac3d045ad9'),
                name: "New name",
                description: "Description 1",
                position: [49, 52],
                address: "Address 1",
                foodtype: "local_food",
                note: 30,
                images: ["image1", "image2"],
            }

            // Call the updateRestaurant function
            await RestaurantService.updateRestaurant("64a685757acccfac3d045ad9", updateValue);
            
            const restaurantUpdated : any= await restaurantCollection.findOne({_id: new ObjectId("64a685757acccfac3d045ad9")});

            // Assert that the result is the expected one
            expect(restaurantUpdated.name).toEqual(updateValue.name);
            
            expect(restaurantUpdated.name).not.toEqual(validRestaurantsData[0].name);
        });
    });

});