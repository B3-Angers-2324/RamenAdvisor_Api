import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Admin from '../models/AdminModel';

async function getOneUser(email: string): Promise<any> {
    const admin = await collections.admin?.findOne({email: email});
    return admin;
}

async function isRightToken(id: string, token: string): Promise<any> {
    // find one user with id and token
    const exist = await collections.admin?.findOne({_id: new ObjectId(id), token: token});
    return exist;
}

async function updateToken(email: string, token: string): Promise<any> {
    const result = await collections.admin?.updateOne({email: email}, {$set: {token: token}});
    return result;
}

export default {
    getOneUser,
    isRightToken,
    updateToken
} as const;