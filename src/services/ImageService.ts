import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Image from '../models/ImageModel';

async function queryImage(id: string){
    const result = await collections.image?.findOne({_id: new ObjectId(id)});
    return result;
}

async function addImage(image: Image){
    const result = await collections.image?.insertOne(image);

    if (result==undefined){
        throw new Error("No restaurants found");
    }

    return result;
}

export default {
    queryImage,
    addImage
} as const;