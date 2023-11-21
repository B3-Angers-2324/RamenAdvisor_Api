import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Report from '../models/ReportModel';
import { CustomError } from '../controllers/types/types';
import HttpStatus from '../constants/HttpStatus';

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

const getReportById = async (reportId : string) : Promise<Report|null> => {
    let result = await collections.report?.findOne({_id: new ObjectId(reportId)});
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

const queryReportedMessages = async (limit :number, offset :number) => {
    let result = await collections.report?.aggregate([
        {
          $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
          $unwind: '$user'
        },
        {
            $lookup: {
                from: 'messages',
                localField: 'messageId',
                foreignField: '_id',
                as: 'message'
                
            }
        },
        {
            $unwind: '$message'
        },
        {
            $lookup: {
                from: 'restaurants',
                localField: 'restaurantId',
                foreignField: '_id',
                as: 'restaurant'
            }
        },
        {
            $unwind: '$restaurant'
        },
        {
            $sort: { date_first: 1 }
        },
        {
            $limit: limit
        },
        {
            $skip: offset
        }
    ]).toArray();
    if (result==undefined){
        throw new Error("Error while retrieving reports");
    }
    return result;
}

const deleteReport = async (reportId : string) => {
    let result = await collections.report?.deleteOne({_id: new ObjectId(reportId)});
    if (result==undefined){
        throw new CustomError("Error while deleting report", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
}

export default {
    addReport,
    getReportByMessageId,
    getReportById,
    updateReport,
    queryReportedMessages,
    deleteReport
} as const;