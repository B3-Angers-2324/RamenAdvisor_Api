import * as db from '../utils/dbHandler'
import {describe, expect, test, beforeAll, afterAll, afterEach} from '@jest/globals';
import { collections } from '../../src/services/Database';
import { Collection, Document, ObjectId } from 'mongodb';
import * as collectionInit from '../utils/collectionInit';

import ReportService from '../../src/services/ReportService';

describe('Test all ReportService function', () => {
  let reportCollection: Collection<Document>;

  beforeAll(async () => {
    await db.connectMongoDB()
    reportCollection = await collectionInit.createReportCollection();
    collections.report = reportCollection as unknown as Collection<Document>;
  });

  afterEach(async () => {
      await db.clearMongoDB()
  });

  afterAll(async () => {
      await db.closeMongoDB()
  });

  describe("Test if addReport work correctely", () => {
    test('addReport with valid report data', async () => {

      const validReportData = {
        userId: '64a685757acccfac3d045ad9',
        restaurantId: '64a685757acccfac3d045ad9',
        messageId: '64a685757acccfac3d045ad9',
        nbReport: 1,
        date_first: new Date(),
      };

      await ReportService.addReport(validReportData);

      // l'utilisateur existe
      const result = await reportCollection.findOne({messageId: new ObjectId("64a685757acccfac3d045ad9")});
      expect(result).not.toBeNull();

      // l'utilisateur n'existe pas
      const result2 = await reportCollection.findOne({messageId: new ObjectId("64a685757acccfac3d045ad8")});
      expect(result2).toBeNull();
    });
  })

  describe("Test if getReportByMessageId work correctely", () => {
    test('getReportByMessageId with valid messageId', async () => {

      const validReportData = {
        userId: new ObjectId('64a685757acccfac3d045ad9'),
        restaurantId: new ObjectId('64a685757acccfac3d045ad9'),
        messageId: new ObjectId('64a685757acccfac3d045ad9'),
        nbReport: 1,
        date_first: new Date(),
      };
      
      await db.addDatasToCollection(reportCollection, [validReportData]);

      // le report existe
      const result = await ReportService.getReportByMessageId("64a685757acccfac3d045ad9");
      expect(result).not.toBeNull();

      // le report n'existe pas
      const result2 = await ReportService.getReportByMessageId("64a685757acccfac3d045ad8");
      expect(result2).toBeNull();
    });
  });

  describe("Test if updateReport work correctely", () => {
    test('updateReport with valid report data', async () => {
      let reportData = {
        _id: new ObjectId('64a685757acccfac3d045ad9'),
        userId: new ObjectId('64a685757acccfac3d045ad9'),
        restaurantId: new ObjectId('64a685757acccfac3d045ad9'),
        messageId: new ObjectId('64a685757acccfac3d045ad9'),
        nbReport: 1,
        date_first: new Date(),
      };
      
      await db.addDatasToCollection(reportCollection, [reportData]);

      reportData.nbReport = 2;

      await ReportService.updateReport(reportData);

      // la valeur a bien été modifié
      const result : any = await reportCollection.findOne({_id: new ObjectId('64a685757acccfac3d045ad9')});
      expect(result.nbReport).toBe(2);

      // le report n'existe pas
      const result2 = await reportCollection.findOne({_id: new ObjectId('64a685757acccfac3d045ad8')});
      expect(result2).toBeNull();

    });
  });
});