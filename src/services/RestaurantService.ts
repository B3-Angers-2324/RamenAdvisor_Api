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
    
    let result = await collections.restaurant?.updateOne({_id: id }, {$set: {note: note, detailNote: detailNote}});
    if (result==undefined){
        throw new Error("Error while updating restaurant");
    }
    return result;
}

const queryRestaurantsWithParam = async (type: string | undefined, accessible: boolean, limit: number, search: string | undefined) => {
    const pipeline = [
        { $match: {
            ...(accessible && { accessible }),
            ...(type && { foodtype: type }),
            /*...(search && { $text: { $search: search, $caseSensitive: false } })*/
            ...(search && { "name": { $regex: search, $options: "i" } })
        }},
        { $sort: { note: -1 }},
        { $limit: limit},
        { $project:{
            _id: 1,
            name: 1,
            foodtype: 1,
            note: 1,
            position: 1,
            images: 1
        }}
    ];
    const restaurants = await collections.restaurant?.aggregate(pipeline)?.toArray();
    return restaurants;
}

const deleteAllRestaurantsByOwner = async (id: string) => {
    let result = await collections.restaurant?.deleteMany({ownerId: new ObjectId(id)});
    if (result==undefined){
        throw new Error("Error while deleting restaurants");
    }
    return result;
}


/*const queryRestaurantsBySearch = async (type : string, accessible:boolean, limit: number, search: string) => {
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
}*/

const updateRestaurantImage = async (uid: string, imageNb: string, imageId: string, alreadyHasImage: boolean) => {
    let result;
    if(alreadyHasImage){
        // update the image id
        result = await collections.restaurant?.updateOne({_id: new ObjectId(uid) }, {$set: {[`images.${imageNb}`]: imageId}});
    }else{
        // add the new image id to the array
        result = await collections.restaurant?.updateOne({_id: new ObjectId(uid) }, {$push: {images: imageId}});
    }
    if (result==undefined){
        throw new Error("Error while updating restaurant");
    }
    return result;
}

const deleteRestaurant = async (id: string) => {
    let result = await collections.restaurant?.deleteOne({_id: new ObjectId(id)});
    if (result==undefined){
        throw new Error("Error while deleting restaurant");
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
    updateRestaurantNote,
    queryRestaurantsWithParam,
    deleteAllRestaurantsByOwner,
    updateRestaurantImage,
    deleteRestaurant
} as const;