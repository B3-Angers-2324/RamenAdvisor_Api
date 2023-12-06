import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Owner from '../models/OwnerModel';

async function getOneOwner(email: string): Promise<any> {
    const owner = await collections.owner?.findOne({email: email});
    return owner;
}

async function addOwner(owner: Owner): Promise<any> {
    const result = await collections.owner?.insertOne(owner);
    return result
}

async function getOwnerById(id: string): Promise<any> {
    const owner = await collections.owner?.findOne({_id: new ObjectId(id)});
    return owner;
}

async function updateOwner(id: string, owner: Owner): Promise<any> {
    const result = await collections.owner?.updateOne({_id: new ObjectId(id)}, {$set: owner});
    return result;
}

async function deleteOwner(id: string): Promise<any> {
    const result = await collections.owner?.deleteOne({_id: new ObjectId(id)});
    return result;
}

async function isRightToken(id: string, token: string): Promise<any> {
    // find one user with id and token
    const exist = await collections.owner?.findOne({_id: new ObjectId(id), token: token});
    return exist;
}

async function updateToken(email: string, token: string): Promise<any> {
    const result = await collections.owner?.updateOne({email: email}, {$set: {token: token}});
    return result;
}

async function isBan(id: string): Promise<any> {
    const result = await collections.owner?.findOne({_id: new ObjectId(id), ban: true});
    return result;
}

async function isValidate(email: string): Promise<any> {
    const result = await collections.owner?.findOne({email: email, validate: true});
    return result;
}


export default {
    getOneOwner,
    addOwner,
    getOwnerById,
    updateOwner,
    deleteOwner,
    isRightToken,
    updateToken,
    isBan,
    isValidate
} as const;