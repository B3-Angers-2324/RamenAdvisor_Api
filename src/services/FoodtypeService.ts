import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Foodtype from '../models/FoodtypeModel';


const queryAll = async () => {
    // query all foodtype names and return them in an array with juste the name
    const result = await collections.foodtype?.find({}).project({name: 1, imgId : 1, _id: 1}).toArray();

    if (result==undefined){
        throw new Error("No restaurants found");
    }

    return result;
}

const queryFoodtype = async (name: string) => {
    const result = await collections.foodtype?.findOne({name: name});

    if (result==undefined){
        throw new Error("No restaurants found");
    }

    return result;
}

const queryFoodtypeById = async (id: string) => {
    const result = await collections.foodtype?.findOne({_id: new ObjectId(id)});

    if (result==undefined){
        throw new Error("No restaurants found");
    }

    return result;
}

const addFoodtype = async (foodtype: Foodtype) => {
    const result = await collections.foodtype?.insertOne(foodtype);

    if (result==undefined){
        throw new Error("Failed to add restaurant");
    }

    return result;
}

const deleteFoodtype = async (id: string) => {
    const result = await collections.foodtype?.deleteOne({_id: new ObjectId(id)});

    if (result==undefined){
        throw new Error("Failed to delete restaurant");
    }

    return result;
}

export default {
    queryAll,
    addFoodtype,
    queryFoodtype,
    deleteFoodtype,
    queryFoodtypeById
} as const;