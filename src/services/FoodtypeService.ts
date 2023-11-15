import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Foodtype from '../models/FoodtypeModel';

const queryAllFoodtype = async () => {    
    const result = await collections.foodtype?.find({}).toArray();

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

export default {
    queryAllFoodtype,
    addFoodtype
} as const;