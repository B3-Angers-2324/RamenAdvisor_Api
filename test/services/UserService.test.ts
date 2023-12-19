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
            image: new ObjectId('64a685757acccfac3d045aa1'),
            token: 'token1',
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
            image: new ObjectId('64a685757acccfac3d045aa2'),
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
            image: new ObjectId('64a685757acccfac3d045aa2'),
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
                image: new ObjectId('64a685757acccfac3d045aa2'),
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
                image: new ObjectId('64a685757acccfac3d045aa2'),
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
                image: new ObjectId('64a685757acccfac3d045aa2'),
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
                image: new ObjectId('64a685757acccfac3d045aa2'),
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


    describe('Test if isRightToken work correctely', () => {
        test('isRightToken of user with id and token', async () => {
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
                    image: new ObjectId('64a685757acccfac3d045aa2'),
                    token: 'token1'
                }
            ];
            await db.addDatasToCollection(userCollection, usersData);

            // there is a user with id and token
            const res = await UserService.isRightToken('64a685757acccfac3d045aa1', 'token1');
            expect(res).not.toBeNull();

            // there is no user with id and token
            const res2 = await UserService.isRightToken('64a685757acccfac3d045aa1', 'token2');
            expect(res2).toBeNull();

            // there is no user with id
            const res3 = await UserService.isRightToken('64a685757acccfac3d045aa2', 'token1');
            expect(res3).toBeNull();

            // there is no user with token
            const res4 = await UserService.isRightToken('64a685757acccfac3d045aa2', 'token3');
            expect(res4).toBeNull();
        })
    })

    describe('Test if updateToken work correctely', () => {
        test('updateToken of user with email and token', async () => {
            const usersData = [
                {
                    _id: new ObjectId('64a685757acccfac3d045aa1'),
                    firstName: 'test1',
                    lastName: 'test1',
                    birthDay: new Date('1999-01-01'),
                    email: 'test1@gmail.com',
                    phone: '0123456789',
                    sexe: 'homme',
                    password: 'test1',
                    ban: false,
                    ville: 'Angers',
                    address: 'test1',
                    image: new ObjectId('64a685757acccfac3d045aa2'),
                }
            ];
            await db.addDatasToCollection(userCollection, usersData);

            // add token
            const res = await UserService.updateToken('test1@gmail.com', 'token1');

            // check if token is added
            const user = await userCollection.findOne({email: 'test1@gmail.com'});
            expect(user?.token).toBe('token1');

            // update token
            const res2 = await UserService.updateToken('test1@gmail.com', 'token2');

            // check if token is updated
            const user2 = await userCollection.findOne({email: 'test1@gmail.com'});
            expect(user2?.token).toBe('token2');
        });
    });

    describe('Test if isBan works correctly', () => {
        test('isBan with valid id', async () => {
          const usersData = [
            {
              _id: new ObjectId('64a685757acccfac3d045aa1'),
              firstName: 'test1',
              lastName: 'test1',
              birthDay: new Date('1999-01-01'),
              email: 'test1@gmail.com',
              phone: '0123456789',
              sexe: 'homme',
              password: 'test1',
              ban: true,
              ville: 'Angers',
              address: 'test1',
              image: new ObjectId('64a685757acccfac3d045aa2'),
            },
            {
              _id: new ObjectId('64a685757acccfac3d045aa2'),
              firstName: 'test1',
              lastName: 'test1',
              birthDay: new Date('1999-01-01'),
              email: 'test1@gmail.com',
              phone: '0123456789',
              sexe: 'homme',
              password: 'test1',
              ban: false,
              ville: 'Angers',
              address: 'test1',
              image: new ObjectId('64a685757acccfac3d045aa2'),
            }
          ];
          await db.addDatasToCollection(userCollection, usersData);
    
          // Call isBan
          const result = await UserService.isBan('64a685757acccfac3d045aa1');
          const result2 = await UserService.isBan('64a685757acccfac3d045aa2');
    
          // Check if the result contains somting in {...}
          expect(result).toBeDefined();
          //check if the result2 equals to be null
          expect(result2).toBeNull();
        })
    })

    describe('Test if getUsersByFirstName works correctly', () => {
        test('getUsersByFirstName with valid firstName', async () => {
            const userData = [
                {
                  _id: new ObjectId('64a685757acccfac3d045aa1'),
                  firstName: 'jean',
                  lastName: 'bernard',
                  birthDay: new Date('1999-01-01'),
                  email: 'test1@gmail.com',
                  phone: '0123456789',
                  sexe: 'homme',
                  password: 'test1',
                  ban: false,
                  ville: 'Angers',
                  address: 'test1',
                  image: new ObjectId('64a685757acccfac3d045aa2'),
                },
                {
                  _id: new ObjectId('64a685757acccfac3d045aa2'),
                  firstName: 'jean',
                  lastName: 'michel',
                  birthDay: new Date('1999-01-01'),
                  email: 'test1@gmail.com',
                  phone: '0123456789',
                  sexe: 'homme',
                  password: 'test1',
                  ban: false,
                  ville: 'Angers',
                  address: 'test1',
                  image: new ObjectId('64a685757acccfac3d045aa2'),
                }
            ];
            await db.addDatasToCollection(userCollection, userData);

            // Call getUsersByFirstName
            const result = await UserService.getUsersByFirstName('jean');
            // Check if the result contains somting in {...}
            expect(result).toBeDefined();
            // Check if the result contains 2 users
            expect(result.length).toBe(2);
        });
    });


    describe('Test if getUsersByLastName works correctly', () => {
        test('getUsersByLastName with valid firstName', async () => {
            const userData = [
                {
                  _id: new ObjectId('64a685757acccfac3d045aa1'),
                  firstName: 'cedrique',
                  lastName: 'michel',
                  birthDay: new Date('1999-01-01'),
                  email: 'test1@gmail.com',
                  phone: '0123456789',
                  sexe: 'homme',
                  password: 'test1',
                  ban: false,
                  ville: 'Angers',
                  address: 'test1',
                  image: new ObjectId('64a685757acccfac3d045aa2'),
                },
                {
                  _id: new ObjectId('64a685757acccfac3d045aa2'),
                  firstName: 'jean',
                  lastName: 'michel',
                  birthDay: new Date('1999-01-01'),
                  email: 'test1@gmail.com',
                  phone: '0123456789',
                  sexe: 'homme',
                  password: 'test1',
                  ban: false,
                  ville: 'Angers',
                  address: 'test1',
                  image: new ObjectId('64a685757acccfac3d045aa2'),
                }
            ];
            await db.addDatasToCollection(userCollection, userData);

            // Call getUsersByFirstName
            const result = await UserService.getUsersByLastName('michel');
            // Check if the result contains somting in {...}
            expect(result).toBeDefined();
            // Check if the result contains 2 users
            expect(result.length).toBe(2);
        });
    });

    describe('Test if getUsersByFirstNameAndLastName works correctly', () => {
        test('getUsersByFirstNameAndLastName with valid firstName', async () => {
            const userData = [
                {
                  _id: new ObjectId('64a685757acccfac3d045aa1'),
                  firstName: 'michel',
                  lastName: 'rodriguez',
                  birthDay: new Date('1999-01-01'),
                  email: 'test1@gmail.com',
                  phone: '0123456789',
                  sexe: 'homme',
                  password: 'test1',
                  ban: false,
                  ville: 'Angers',
                  address: 'test1',
                  image: new ObjectId('64a685757acccfac3d045aa2'),
                },
                {
                  _id: new ObjectId('64a685757acccfac3d045aa2'),
                  firstName: 'jean',
                  lastName: 'michel',
                  birthDay: new Date('1999-01-01'),
                  email: 'test1@gmail.com',
                  phone: '0123456789',
                  sexe: 'homme',
                  password: 'test1',
                  ban: false,
                  ville: 'Angers',
                  address: 'test1',
                  image: new ObjectId('64a685757acccfac3d045aa2'),
                }
            ];
            await db.addDatasToCollection(userCollection, userData);

            // Call getUsersByFirstName
            const result = await UserService.getUsersByFirstNameAndLastName('michel', "rodriguez");
            // Check if the result contains somting in {...}
            expect(result).toBeDefined();
            // Check if the result contains 2 users
            expect(result.length).toBe(1);
        });
    });
})