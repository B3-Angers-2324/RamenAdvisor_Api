import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Message from '../models/MessageModel';

async function queryMessagesForRestaurant(restaurantId: string, limit: number, offset: number) {
    const result = await collections.message?.aggregate([
        { $match: { restaurantId: new ObjectId(restaurantId) } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        { $unwind: '$user'},
        { $sort: { date: -1 } },
        { $skip: offset },
        { $limit: limit },
    ]).toArray();
    return result;
}

async function queryOne(messageId:string) {
    const result = await collections.message?.findOne({_id: new ObjectId(messageId)});
    return result;
}

async function deleteMessage(messageId:string) {
    const result = await collections.message?.deleteOne({_id: new ObjectId(messageId)});
    return result;
}

export default {
    queryMessagesForRestaurant,
    queryOne,
    deleteMessage
} as const;