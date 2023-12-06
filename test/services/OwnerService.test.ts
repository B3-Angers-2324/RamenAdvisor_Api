import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import OwnerService from '../../src/services/OwnerService';

describe('Test all OwnerService function', () => {
  let ownerCollection: Collection<Document>;

  beforeAll(async () => {
      await db.connectMongoDB()
      ownerCollection = await collectionInit.createOwnerCollection();
      collections.owner = ownerCollection as unknown as Collection<Document>;
  });

  afterEach(async () => {
      await db.clearMongoDB()
  });

  afterAll(async () => {
      await db.closeMongoDB()
  });
  
  describe('Test if getOneOwner work correctely', () => {
    test('getOneOwner of owner with email', async () => {

        const ownersData = [
            {
            firstName: 'test1',
            lastName: 'test1',
            email: 'owner1@gmail.com',
            password: 'test1',
            siret: 'test1',
            companyName: 'test1',
            socialAdresse: 'test1',
            }
        ];
        
        await db.addDatasToCollection(ownerCollection, ownersData);

        // l'utilisateur existe
        const res = await OwnerService.getOneOwner('owner1@gmail.com');
        expect(res).not.toBeNull();

        // l'utilisateur n'existe pas
        const res2 = await OwnerService.getOneOwner('owner2@gmail.com');
        expect(res2).toBeNull();
    });
  })

  describe('Test if addOwner work correctely', () => {
    test('addOwner with valid owner data', async () => {
  
      const validOwnerData = {
        firstName: 'test1',
        lastName: 'test1',
        email: 'owner3@gmail.com',
        password: 'test1',
        siret: 'test1',
        companyName: 'test1',
        socialAdresse: 'test1',
      };

      await OwnerService.addOwner(validOwnerData);

      // l'utilisateur existe
      const res = ownerCollection.findOne({email: 'owner3@gmail.com'});
      expect(res).not.toBeNull();
      
      // l'utilisateur n'existe pas
      const res2 = await OwnerService.getOneOwner('owner2@gmail.com');
      expect(res2).toBeNull();
    });
  });


  describe('Test if getOwnerById works correctly', () => {
    test('getOwnerById with valid id', async () => {
      const ownerId = '64a685757acccfac3d045ad9';
      const ownerData = {
        _id: new ObjectId(ownerId),
        firstName: 'test1',
        lastName: 'test1',
        email: 'owner1@gmail.com',
        password: 'test1',
        siret: 'test1',
        companyName: 'test1',
        socialAdresse: 'test1',
      };
  
      // Add owner to the collection
      await db.addDatasToCollection(ownerCollection, [ownerData]);
  
      // Call getOwnerById
      const result = await OwnerService.getOwnerById(ownerId);
  
      // Check if the result matches the owner data
      expect(result).toEqual(ownerData);
    });
  
    test('getOwnerById with invalid id', async () => {
      const invalidOwnerId = '64a685757acccfac3d045ad5';
  
      // Call getOwnerById
      const result = await OwnerService.getOwnerById(invalidOwnerId);
  
      // Check if the result is null
      expect(result).toBeNull();
    });
  });



  describe('Test if updateOwner works correctly', () => {
    test('updateOwner with valid id and owner data', async () => {
      const ownerId = '64a685757acccfac3d045ad9';
      const updatedOwner = {
        firstName: 'updatedFirstName',
        lastName: 'updatedLastName',
        email: 'updatedEmail@gmail.com',
        password: 'updatedPassword',
        siret: 'updatedSiret',
        companyName: 'updatedCompanyName',
        socialAdresse: 'updatedSocialAdresse',
      };
  
      // Add owner to the collection
      await db.addDatasToCollection(ownerCollection, [
        {
          _id: new ObjectId(ownerId),
          firstName: 'test1',
          lastName: 'test1',
          email: 'owner1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
        },
      ]);
  
      // Update owner
      const result = await OwnerService.updateOwner(ownerId, updatedOwner);
  
      // Check if the update was successful
      expect(result).toBeDefined();
      expect(result.modifiedCount).toBe(1);
  
      // Check if the owner was updated correctly
      const res = await ownerCollection.findOne({ _id: new ObjectId(ownerId) });
      expect(res).toEqual(expect.objectContaining(updatedOwner));
    });
  
    test('updateOwner with invalid id', async () => {
      const invalidOwnerId = '64a685757acccfac3d045ad5';
      const updatedOwner = {
        firstName: 'updatedFirstName',
        lastName: 'updatedLastName',
        email: 'updatedEmail@gmail.com',
        password: 'updatedPassword',
        siret: 'updatedSiret',
        companyName: 'updatedCompanyName',
        socialAdresse: 'updatedSocialAdresse',
      };
  
      const result = await OwnerService.updateOwner(invalidOwnerId, updatedOwner);

      //check if the update was not successful
      expect(result).toBeDefined();
    });
  });


  describe('Test if deleteOwner works correctly', () => {
    test('deleteOwner with valid id', async () => {
      const ownerId = '64a685757acccfac3d045ad9';
  
      // Add owner to the collection
      await db.addDatasToCollection(ownerCollection, [
        {
          _id: new ObjectId(ownerId),
          firstName: 'test1',
          lastName: 'test1',
          email: 'owner1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
        },
      ]);
  
      // Call deleteOwner
      const result = await OwnerService.deleteOwner(ownerId);
  
      // Check if the delete was successful
      expect(result).toBeDefined();
      expect(result.deletedCount).toBe(1);
  
      // Check if the owner was deleted from the collection
      const res = await ownerCollection.findOne({ _id: new ObjectId(ownerId) });
      expect(res).toBeNull();
    });
  
    test('deleteOwner with invalid id', async () => {
      const invalidOwnerId = '64a685757acccfac3d045ad5';
  
      const result = await OwnerService.deleteOwner(invalidOwnerId);
  
      // Check if the delete was not successful
      expect(result).toBeDefined();
      expect(result.deletedCount).toBe(0);
    });
  });

  describe('Test if isRightToken work correctely', () => {
    test('isRightToken of owner with id and token', async () => {
      const ownersData = [
          {
              _id: new ObjectId('64a685757acccfac3d045aa1'),
              firstName: 'test1',
              lastName: 'test1',
              email: 'owner1@gmail.com',
              password: 'test1',
              siret: 'test1',
              companyName: 'test1',
              socialAdresse: 'test1',
              token: 'token1'
          }
      ];
      await db.addDatasToCollection(ownerCollection, ownersData);

      // there is a user with id and token
      const res = await OwnerService.isRightToken('64a685757acccfac3d045aa1', 'token1');
      expect(res).not.toBeNull();

      // there is no user with id and token
      const res2 = await OwnerService.isRightToken('64a685757acccfac3d045aa1', 'token2');
      expect(res2).toBeNull();

      // there is no user with id
      const res3 = await OwnerService.isRightToken('64a685757acccfac3d045aa2', 'token1');
      expect(res3).toBeNull();

      // there is no user with token
      const res4 = await OwnerService.isRightToken('64a685757acccfac3d045aa2', 'token3');
      expect(res4).toBeNull();
    })
  })

  describe('Test if updateToken work correctely', () => {
    test('updateToken of owner with email and token', async () => {
      const ownersData = [
          {
              _id: new ObjectId('64a685757acccfac3d045aa1'),
              firstName: 'test1',
              lastName: 'test1',
              email: 'test1@gmail.com',
              password: 'test1',
              siret: 'test1',
              companyName: 'test1',
              socialAdresse: 'test1',
          }
      ];
      await db.addDatasToCollection(ownerCollection, ownersData);

      // add token
      const res = await OwnerService.updateToken('test1@gmail.com', 'token1');

      // check if token is added
      const owner = await ownerCollection.findOne({email: 'test1@gmail.com'});
      expect(owner?.token).toBe('token1');

      // update token
      const res2 = await OwnerService.updateToken('test1@gmail.com', 'token2');

      // check if token is updated
      const owner2 = await ownerCollection.findOne({email: 'test1@gmail.com'});
      expect(owner2?.token).toBe('token2');

    })
  })

  describe('Test if isBan works correctly', () => {
    test('isBan with valid id', async () => {
      const ownersData = [
        {
          _id: new ObjectId('64a685757acccfac3d045aa1'),
          firstName: 'test1',
          lastName: 'test1',
          email: 'owner1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
          ban: true,
        },
        {
          _id: new ObjectId('64a685757acccfac3d045aa2'),
          firstName: 'test1',
          lastName: 'test1',
          email: 'owner1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
        }
      ];
      await db.addDatasToCollection(ownerCollection, ownersData);

      // Call isBan
      const result = await OwnerService.isBan('64a685757acccfac3d045aa1');
      const result2 = await OwnerService.isBan('64a685757acccfac3d045aa2');

      // Check if the result contains somting in {...}
      expect(result).toBeDefined();
      //check if the result2 equals to be null
      expect(result2).toBeNull();
    })
  })

  describe('Test if isValidate works correctly', () => {
    test('isValidate with valid id', async () => {
      const ownersData = [
        {
          _id: new ObjectId('64a685757acccfac3d045aa1'),
          firstName: 'test1',
          lastName: 'test1',
          email: 'owner1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
          validate: true,
        },
        {
          _id: new ObjectId('64a685757acccfac3d045aa2'),
          firstName: 'test1',
          lastName: 'test1',
          email: 'owner1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
          validate: false,
        }
      ];
      await db.addDatasToCollection(ownerCollection, ownersData);

      // Call isValidate
      const result = await OwnerService.isValidate('64a685757acccfac3d045aa1');
      const result2 = await OwnerService.isValidate('64a685757acccfac3d045aa2');

      // Check if the result contains somting in {...}
      expect(result).toBeDefined();
      //check if the result2 equals to be null
      expect(result2).toBeNull();

    })
  })

})
