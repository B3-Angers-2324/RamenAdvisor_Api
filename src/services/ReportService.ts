import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Report from '../models/ReportModel';

const addReport = async (report : any): Promise<any> => {
    let result = await collections.report?.insertOne(new Report(
        new ObjectId(report.userId),
        new ObjectId(report.restaurantId),
        new ObjectId(report.messageId),
        report.date_first,
        report.nbReport
    
    ));
    if (result==undefined){
        throw new Error("Error while creating report");
    }
    return result;
}

const getReportByMessageId = async (messageId : string) : Promise<Report|null> => {
    let result = await collections.report?.findOne({messageId: new ObjectId(messageId)});
    if (result===undefined){
        throw new Error("Error while retrieving report");
    }else if (result===null){
        return null;
    }
    return new Report(
        result.userId,
        result.restaurantId,
        result.messageId,
        result.date_first,
        result.nbReport,
        result._id
    );
}

const updateReport = async (report : Report) => {
    let result = await collections.report?.updateOne({_id: new ObjectId(report._id) }, {$set: report});
    if (result==undefined){
        throw new Error("Error while updating report");
    }
    return result;
}

export default {
    addReport,
    getReportByMessageId,
    updateReport
} as const;