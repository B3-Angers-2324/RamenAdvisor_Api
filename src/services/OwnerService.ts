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

const queryOwnerNoValidate = async () => {
    let owners = await collections.owner?.find({validate: false}).toArray();
    if (owners==undefined){
        throw new Error("No unvalid owner found");
    }
    return owners;
}

async function addOwner(owner: Owner): Promise<any> {
    try{
        const result = await collections.owner?.insertOne(owner);
        return result
    }catch(error){
        throw error;
    }
}

async function getOwnerById(id: string): Promise<any> {
    try{
        const owner = await collections.owner?.findOne({_id: new ObjectId(id)});
        return owner;
    }catch(error){
        throw error;
    }

}

async function getAll () {
    let owners = await collections.owner?.find({}).toArray();
    if (owners==undefined){
        throw new Error("No unvalid owner found");
    }
    return owners;
}

async function updateOwner(id: string, owner: Owner): Promise<any> {
    try{
        const result = await collections.owner?.updateOne({_id: new ObjectId(id)}, {$set: owner});
        return result;
    }catch(error){
        throw error;
    }
}

async function deleteOwner(id: string): Promise<any> {
    try{
        const result = await collections.owner?.deleteOne({_id: new ObjectId(id)});
        return result;
    }catch(error){
        throw error;
    }
}

export default {
    getOneOwner,
    addOwner,
    getOwnerById,
    updateOwner,
    deleteOwner,
    queryOwnerNoValidate,
    getAll
} as const;