import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Restaurant from '../models/RestaurantModel';

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
    // console.log(typeof detailNote, typeof detailNote[0]);
    let result = await collections.restaurant?.updateOne({_id: id }, {$set: {note: note, detailNote: detailNote}});
    if (result==undefined){
        throw new Error("Error while updating restaurant");
    }
    return result;
}

const queryRestaurantsWithParam = async (type: string|undefined, accessible: boolean, limit: number, search: string|undefined) => {
    const param = {
        ...(accessible && { accessible }),
        ...(type && { foodtype: type }),
        ...(search && { $text: { $search: search , $caseSensitive:false} })
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


export default {
    queryBestRestaurants,
    queryRestaurantById,
    queryRestaurantsByOwner,
    createRestaurant,
    updateRestaurant,
    restaurantExistsById,
    updateRestaurantNote,
    queryRestaurantsWithParam,
    deleteAllRestaurantsByOwner
} as const;