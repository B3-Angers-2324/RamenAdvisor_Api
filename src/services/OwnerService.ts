import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Owner from '../models/OwnerModel';

async function getOneOwner(email: string): Promise<any> {
    try{
        const owner = await collections.owner?.findOne({email: email});
        return owner;
    }catch(error){
        throw error;
    }
}

async function addOwner(owner: Owner): Promise<any> {
    try{
        const result = await collections.owner?.insertOne(owner);
        return result
    }catch(error){
        throw error;
    }
}


export default {
    getOneOwner,
    addOwner
} as const;