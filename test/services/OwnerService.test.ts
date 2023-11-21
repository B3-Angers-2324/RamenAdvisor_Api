import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document } from 'mongodb';
import mongoose from 'mongoose';

import OwnerService from '../../src/services/OwnerService';

describe('Test all OwnerService function', () => {
  const ownerCollection = mongoose.connection.collection('owners');
  collections.owner = ownerCollection as unknown as Collection<Document>;

  beforeAll(async () => {
      await db.connect()
  });
  afterEach(async () => {
      await db.clearDatabase()
  });
  afterAll(async () => {
      await db.closeDatabase()
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
      const res = await OwnerService.getOneOwner('owner3@gmail.com');
      expect(res).not.toBeNull();

      // l'utilisateur n'existe pas
      const res2 = await OwnerService.getOneOwner('owner4@gmail.com');
      expect(res2).toBeNull();
    });
  })
})

