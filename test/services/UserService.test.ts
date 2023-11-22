import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import UserService from '../../src/services/UserService';

describe('Test all UserService function', () => {
    let userCollection: Collection<Document>;

    beforeAll(async () => {
        await db.connectMongoDB()
        
        userCollection = await collectionInit.createUserCollection();
        collections.user = userCollection as unknown as Collection<Document>;
    });

    afterEach(async () => {
        await db.clearMongoDB()
    });

    afterAll(async () => {
        await db.closeMongoDB()
    });

    const usersData = [
        {
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

    describe('Test if getOneUser work correctely', () => {
        test('getOneUser of user with email', async () => {

            await db.addDatasToMongoDB(userCollection, usersData);

            // l'utilisateur existe
            const res = await UserService.getOneUser('user1@gmail.com');
            expect(res).not.toBeNull();

            // l'utilisateur n'existe pas
            const res2 = await UserService.getOneUser('user2@gmail.com');
            expect(res2).toBeNull();
        })
    })

    describe('Test if addUser work correctely', () => {
        test('addUser with valid user data', async () => {
            
            await UserService.addUser(usersData[0]);

            // l'utilisateur existe
            const res = await userCollection.findOne({email: 'user1@gmail.com'});
            expect(res).not.toBeNull();

            // l'utilisateur n'existe pas
            const res2 = await userCollection.findOne({email: 'user2@gmail.com'});
            expect(res2).toBeNull();
        })
    })

    describe('Test if getAll work correctely', () => {
        test('getAll', async () => {
            
            await db.addDatasToMongoDB(userCollection, usersData);

            const res = await UserService.getAll();
            expect(res.length).toBe(2);
        })
    })

    describe('Test if getOne work correctely', () => {
        test('getOne of user with id', async () => {
            
            await db.addDatasToMongoDB(userCollection, usersData);

            const user = await userCollection.findOne({email: 'user3@gmail.com'});
            
            // l'utilisateur existe
            const res = await UserService.getOne(user?._id?.toString() || '');
            expect(res).not.toBeNull();

            // l'utilisateur n'existe pas
            const res2 = await UserService.getOne('123456789078');
            expect(res2).toBeNull();
        })
    })




    describe('Test if getUserById works correctly', () => {
        test('getUserById with valid id', async () => {
          const userId = '64a685757acccfac3d045ad9';
          const userData = {
            _id: new ObjectId(userId),
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
          };
      
          // Add owner to the collection
          await db.addDatasToCollection(userCollection, [userData]);
      
          // Call getOwnerById
          const result = await UserService.getUserById(userId);
      
          // Check if the result matches the owner data
          expect(result).toEqual(userData);
        });
      
        test('getUserById with invalid id', async () => {
          const invaliduserId = '64a685757acccfac3d045ad5';
      
          // Call getOwnerById
          const result = await UserService.getUserById(invaliduserId);
      
          // Check if the result is null
          expect(result).toBeNull();
        });
    });
    
    
    
    describe('Test if updateUser works correctly', () => {
        test('updateUser with valid id and user data', async () => {
            const userId = '64a685757acccfac3d045ad9';
            const updatedUser = {
                firstName: 'updateName',
                lastName: 'update',
                birthDay: new Date('1999-01-01'),
                email: 'update@gmail.com',
                phone: '0123456789',
                sexe: 'update',
                password: 'update',
                ban: true,
                ville: 'update',
                address: 'update',
                image: 'update',
            };
        
            // Add owner to the collection
            await db.addDatasToCollection(userCollection, [
            {
                _id: new ObjectId(userId),
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
            ]);
        
            // Update owner
            const result = await UserService.updateUser(userId, updatedUser);
        
            // Check if the update was successful
            expect(result).toBeDefined();
            expect(result.modifiedCount).toBe(1);
        
            // Check if the owner was updated correctly
            const res = await userCollection.findOne({ _id: new ObjectId(userId) });
            expect(res).toEqual(expect.objectContaining(updatedUser));
        });
        
        test('updateUser with invalid id', async () => {
            const invaliduserId = '64a685757acccfac3d045ad5';
            const updatedUser = {
                firstName: 'updateName',
                lastName: 'update',
                birthDay: new Date('1999-01-01'),
                email: 'update@gmail.com',
                phone: '0123456789',
                sexe: 'update',
                password: 'update',
                ban: true,
                ville: 'update',
                address: 'update',
                image: 'update',
            };
        
            const result = await UserService.updateUser(invaliduserId, updatedUser);

            //check if the update was not successful
            expect(result).toBeDefined();
        });
        });


        describe('Test if deleteUser works correctly', () => {
        test('deleteUser with valid id', async () => {
            const userId = '64a685757acccfac3d045ad9';
        
            // Add owner to the collection
            await db.addDatasToCollection(userCollection, [
            {
                _id: new ObjectId(userId),
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
            ]);
        
            // Call deleteOwner
            const result = await UserService.deleteUser(userId);
        
            // Check if the delete was successful
            expect(result).toBeDefined();
            expect(result.deletedCount).toBe(1);
        
            // Check if the owner was deleted from the collection
            const res = await userCollection.findOne({ _id: new ObjectId(userId) });
            expect(res).toBeNull();
        });
        
        test('deleteUser with invalid id', async () => {
            const invaliduserId = '64a685757acccfac3d045ad5';
        
            const result = await UserService.deleteUser(invaliduserId);
        
            // Check if the delete was not successful
            expect(result).toBeDefined();
            expect(result.deletedCount).toBe(0);
        });
    });
})