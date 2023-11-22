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

})
