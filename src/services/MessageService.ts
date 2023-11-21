import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Message from '../models/MessageModel';

async function queryMessagesForRestaurant(restaurantId:string, limit:number, offset:number) {
    const result = await collections.message?.find({restaurantId:  new ObjectId(restaurantId)},{
        sort: { date: -1 },
        limit: limit,
        skip: offset
    }).toArray();
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