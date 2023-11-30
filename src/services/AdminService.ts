import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Admin from '../models/AdminModel';

async function getOneUser(email: string): Promise<any> {
    try{
        const admin = await collections.admin?.findOne({email: email});
        return admin;
    }catch(error){
        throw error;
    }
}

async function isRightToken(id: string, token: string): Promise<any> {
    try{
        // find one user with id and token
        const exist = await collections.admin?.findOne({_id: new ObjectId(id), token: token});
        return exist;
    }catch(error){
        throw error;
    }

}

async function updateToken(email: string, token: string): Promise<any> {
    try{
        const result = await collections.admin?.updateOne({email: email}, {$set: {token: token}});
        return result;
    }catch(error){
        throw error;
    }
}

export default {
    getOneUser,
    isRightToken,
    updateToken
} as const;