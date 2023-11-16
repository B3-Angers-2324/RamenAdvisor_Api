
import { MongoClient, ObjectId, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ReportService from '../../src/services/ReportService';
import Report from '../../src/models/ReportModel';
import {describe, expect, beforeAll, afterAll, afterEach, it, test} from '@jest/globals'

describe('ReportService', () => {
    let connection: MongoClient;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        const uri = mongoServer.getUri();
        connection = await MongoClient.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as MongoClientOptions);
    });

    afterAll(async () => {
        await connection.close();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await connection.db().collection('reports').deleteMany({});
    });

    describe('addReport', () => {
        it('should add a report to the database', async () => {
            const report: Report = {
                userId: new ObjectId('123'),
                restaurantId: new ObjectId('123'),
                messageId: new ObjectId('123'),
                nbReport: 1,
                date_first: new Date(),
            };

            await ReportService.addReport(report);

            const reports = await connection.db().collection('reports').find().toArray();
            expect(reports).toHaveLength(1);
            expect(reports[0]).toMatchObject(report as unknown as Record<string, unknown>);
        });
    });

    describe('getReportByMessageId', () => {
        it('should get a report by its messageId', async () => {
            const report: Report = {
                userId: new ObjectId('123'),
                restaurantId: new ObjectId('123'),
                messageId: new ObjectId('123'),
                nbReport: 1,
                date_first: new Date(),
            };

            await connection.db().collection('reports').insertOne(report);

            const result = await ReportService.getReportByMessageId('123');

            expect(result).toMatchObject(report as unknown as Record<string, unknown>);
        });
    });

    describe('updateReport', () => {
        it('should update a report in the database', async () => {
            const report: Report = {
                userId: new ObjectId('123'),
                restaurantId: new ObjectId('123'),
                messageId: new ObjectId('123'),
                nbReport: 1,
                date_first: new Date(),
            };
    
            await connection.db().collection('reports').insertOne(report);

            const updatedReport: Report = {
                userId: new ObjectId('123'),
                restaurantId: new ObjectId('123'),
                messageId: new ObjectId('123'),
                nbReport: 2,
                date_first: new Date(),
            };

            await ReportService.updateReport(updatedReport);

            const reports = await connection.db().collection('reports').find().toArray();
            expect(reports).toHaveLength(1);
            expect(reports[0]).toMatchObject(updatedReport as unknown as Record<string, unknown>);
        });
    });
});