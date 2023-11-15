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

const queryRestaurantsWithParam = async (type: string|undefined, accessible: boolean, limit: number, search: string|undefined) => {
    const param = {
        ...(accessible && { accessible }),
        ...(type && { foodtype: type }),
        ...(search && { $text: { $search: search } })
    };
    const restaurants = await collections.restaurant?.find(param, {
        sort: { note: -1 },
        limit
    })?.toArray();
    if (!restaurants?.length) {
        throw new Error("No restaurants found");
    }
    return restaurants;
}


const queryRestaurantsBySearch = async (type : string, accessible:boolean, limit: number, search: string) => {
    let param :{
        accessible?: boolean,
        foodtype?: string
    }={};
    if (accessible)param.accessible = accessible;
    if (type!="none") param.foodtype = type;
    let restaurants = await collections.restaurant?.find({
        ...param,
        $text: { $search: search }
    },{
        sort: { note: -1 },
        limit: limit 
    }).toArray();
    if (restaurants==undefined || restaurants.length==0){
        throw new Error("No restaurants found");
    }
    return restaurants;
}


export default {
    queryBestRestaurants,
    queryRestaurantById,
    queryRestaurantsByOwner,
    queryRestaurantsWithParam,
} as const;