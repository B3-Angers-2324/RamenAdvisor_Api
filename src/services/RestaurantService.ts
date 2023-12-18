import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Restaurant from '../models/RestaurantModel';
import { cp } from 'fs';
import OwnerServices from "../services/OwnerService";

const queryBestRestaurants = async (limit : number) => {
    let restaurants = await collections.restaurant?.find({},{
        sort: { note: -1 },
        limit: limit 
    }).toArray();

    if (restaurants != undefined) {
        let ownerId = "";
        let owner;
        for (let i=0; i<restaurants?.length; i++) {
            ownerId = restaurants[i].ownerId;
            owner = await OwnerServices.getOwnerById(ownerId);
            if (owner != undefined) {
                if (owner.ban) restaurants.splice(i, 1);
            }
        }
    }

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

const createRestaurant = async (restaurant : Restaurant): Promise<any> => {
    let result = await collections.restaurant?.insertOne(restaurant);
    if (result==undefined){
        throw new Error("Error while creating restaurant");
    }
    return result;
}

const updateRestaurant = async (id: string, restaurant : Restaurant) => {
    let result = await collections.restaurant?.updateOne({_id: new ObjectId(id) }, {$set: restaurant});
    if (result==undefined){
        throw new Error("Error while updating restaurant");
    }
    return result;
}

export default {
    queryBestRestaurants,
    queryRestaurantById,
    queryRestaurantsByOwner,
    createRestaurant,
    updateRestaurant
} as const;