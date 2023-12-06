import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Message from '../models/MessageModel';
import { off } from 'process';

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

async function deleteAllMessagesForUser(userId: string) {
    const result = await collections.message?.deleteMany({userId: new ObjectId(userId)});
    return result;
}

async function deleteAllMessagesForRestaurant(restaurantId: string) {
    const result = await collections.message?.deleteMany({restaurantId: new ObjectId(restaurantId)});
    return result;
}

async function addMessage(message: Message) {
    const result = await collections.message?.insertOne(message);
    return result;
}

async function lasTimeUserSentMessage(userId: string, restaurantId: string) {
    const result = await collections.message?.findOne({ userId: new ObjectId(userId), restaurantId: new ObjectId(restaurantId) }, { sort: { date: -1 } });
    return result;
}

async function queryMessagesForUser(userId: string, limit: number, offset: number) {
    const result = await collections.message?.aggregate([
        { $match: { userId: new ObjectId(userId) } },
        { $lookup: { from: 'restaurants', localField: 'restaurantId', foreignField: '_id', as: 'restaurant' } },
        { $unwind: '$restaurant'},
        { $sort: { date: -1 } },
        { $skip: offset },
        { $limit: limit },
        { $project: {
            _id: 1,
            "restaurant.name": 1,
            "restaurant._id": 1,
            message: 1,
            date: 1,
            note: 1
        } }
    ]).toArray();
    return result;
}

export default {
    queryMessagesForRestaurant,
    queryOne,
    deleteMessage,
    addMessage,
    deleteAllMessagesForUser,
    deleteAllMessagesForRestaurant,
    lasTimeUserSentMessage,
    queryMessagesForUser
} as const;