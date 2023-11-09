import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Restaurant from '../models/RestaurantModel';
import { cp } from 'fs';

const queryBestRestaurants = async (limit : number) => {
    let restaurants = await collections.restaurant?.find({},{
        sort: { note: -1 },
        limit: limit 
    }).toArray();
    if (restaurants==undefined){
        throw new Error("No restaurants found");
    }
    return restaurants;
}

const queryRestaurantById = async (id : string) => {
    let restaurant = await collections.restaurant?.findOne({_id: new ObjectId(id)});
    if (restaurant==undefined){
        throw new Error("No restaurant found");
    }
    return restaurant;
}

const queryRestaurantsByOwner = async (id : string) => {
    let restaurants = await collections.restaurant?.find({ownerId: new ObjectId(id)}).toArray();
    if (restaurants==undefined){
        throw new Error("No restaurants found");
    }
    return restaurants;
}


export default {
    queryBestRestaurants,
    queryRestaurantById,
    queryRestaurantsByOwner
} as const;