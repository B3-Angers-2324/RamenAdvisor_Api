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
        throw new Error("No restaurants found", );
    }
    return restaurants;
}

const queryRestaurantById = async (id : string) => {
    let restaurant = await collections.restaurant?.findOne({_id: new ObjectId(id)});
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

const restaurantExistsById = async (id: string) => {
    try{
        return (await collections.restaurant?.findOne({_id: new ObjectId(id)})==null)? false : true;
    }catch(e){
        return false;
    }
}

const updateRestaurantNote = async (id: ObjectId, note : number, detailNote: Array<{percentage: number; nbNote:number}>) => {
    console.log(typeof detailNote, typeof detailNote[0]);
    let result = await collections.restaurant?.updateOne({_id: id }, {$set: {note: note, detailNote: detailNote}});
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
    updateRestaurant,
    restaurantExistsById,
    updateRestaurantNote
} as const;