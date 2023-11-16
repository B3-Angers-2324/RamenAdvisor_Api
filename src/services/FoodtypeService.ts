import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Foodtype from '../models/FoodtypeModel';

// const queryAllFoodtype = async () => {    
//     const result = await collections.foodtype?.find({}).toArray();

//     if (result==undefined){
//         throw new Error("No restaurants found");
//     }

//     return result;
// }

const queryAllFoodtypeByName = async () => {
    // query all foodtype names and return them in an array with juste the name
    const result = await collections.foodtype?.find({}).project({name: 1, _id: 0}).toArray();

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

const addFoodtype = async (foodtype: Foodtype) => {
    const result = await collections.foodtype?.insertOne(foodtype);

    if (result==undefined){
        throw new Error("Failed to add restaurant");
    }

    return result;
}

export default {
    queryAllFoodtypeByName,
    addFoodtype,
    queryFoodtype
} as const;