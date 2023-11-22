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

export default {
    getOneUser,
} as const;