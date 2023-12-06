import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Moderator from '../models/ModeratorModel';

async function getOneModo(email: string): Promise<any> {
    const moderator = await collections.moderator?.findOne({email: email});
    return moderator;
}

async function getOneModoById(id: string): Promise<any> {
    const moderator = await collections.moderator?.findOne({_id: new ObjectId(id)});
    return moderator;
}

async function isRightToken(id: string, token: string): Promise<any> {
    // find one user with id and token
    const exist = await collections.moderator?.findOne({_id: new ObjectId(id), token: token});
    return exist;
}

async function updateToken(email: string, token: string): Promise<any> {
    const result = await collections.moderator?.updateOne({email: email}, {$set: {token: token}});
    return result;
}

async function addModerator(moderator: Moderator): Promise<any> {
    const result = await collections.moderator?.insertOne(moderator);
    return result;
}

async function deleteModerator(id: string): Promise<any> {
    const result = await collections.moderator?.deleteOne({_id: new ObjectId(id)});
    return result;
}

async function getModerators(): Promise<any> {
    const moderators = await collections.moderator?.find({}, {projection: {_id: 1, email: 1}}).toArray();
    return moderators;
}



export default {
    getOneModo,
    getOneModoById,
    isRightToken,
    updateToken,
    addModerator,
    deleteModerator,
    getModerators
} as const;