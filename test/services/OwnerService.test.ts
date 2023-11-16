import app from '../../app'
import * as db from '../utils/dbHandler'
import supertest from 'supertest'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document } from 'mongodb';
import mongoose from 'mongoose';

import OwnerService from '../../src/services/OwnerService';

const request = supertest(app)

describe('Test all OwnerService function', () => {
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
        const ownerCollection = mongoose.connection.collection('owners');
        collections.owner = ownerCollection as unknown as Collection<Document>;

        const ownersData = [
            {
            firstName: 'test1',
            lastName: 'test1',
            email: 'j1@gmail.com',
            password: 'test1',
            siret: 'test1',
            companyName: 'test1',
            socialAdresse: 'test1',
            }
        ];
        
        await db.addDatasToCollection(ownerCollection, ownersData);

        const res = await OwnerService.getOneOwner('j1@gmail.com');
        const res2 = await OwnerService.getOneOwner('j2@gmail.com');

        // todo : add more test

        // Vérifiez que les résultats sont ceux que vous attendez
        expect(res).not.toBeNull();
        expect(res2).toBeNull();
    });
  })

  describe('Test if addOwner work correctely', () => {
    test('addOwner of owner with email', async () => {
        const ownerCollection = mongoose.connection.collection('owners');
        collections.owner = ownerCollection as unknown as Collection<Document>;

        const ownersData = [
          {
          firstName: 'test1',
          lastName: 'test1',
          email: 'j1@gmail.com',
          password: 'test1',
          siret: 'test1',
          companyName: 'test1',
          socialAdresse: 'test1',
          }
        ];

        const res = await OwnerService.addOwner(ownersData[0]);
        
        //todo : add more test

        // Vérifiez que les résultats sont ceux que vous attendez
        expect(res).not.toBeNull();
    });
  })
})

