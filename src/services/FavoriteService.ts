import { ObjectId } from 'mongodb';
import { collections } from './Database';
import Favorite from '../models/FavoriteModel';

async function addFavorite(favorite: Favorite): Promise<any> {
    try{
        const result = await collections.favorite?.insertOne(favorite);
        return result
    }catch(error){
        throw error;
    }
}

async function deleteFavorite(userId: string, restId: string): Promise<any> {
    const result = await collections.favorite?.deleteOne({userId: new ObjectId(userId), restaurantId: new ObjectId(restId)});
    return result;
}

async function deleteFavoriteByRestaurant(restId: string): Promise<any> {
    const result = await collections.favorite?.deleteMany({restaurantId: new ObjectId(restId)});
    return result;
}

async function deleteFavoriteByUser(userId: string): Promise<any> {
    const result = await collections.favorite?.deleteMany({userId: new ObjectId(userId)});
    return result;
}

async function getFavoriteByUser (id: string) {
    try {
        let params = [
            {
                $match: { userId: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'restaurants', 
                    localField: 'restaurantId',
                    foreignField: '_id',
                    as: 'restaurant'
                }
            },
            {
                $unwind: '$restaurant'
            },
            {
                $lookup: {
                    from: 'foodtypes', 
                    localField: 'restaurant.foodtype',
                    foreignField: 'name',
                    as: 'foodtype'
                }
            },
            {
                $unwind: '$foodtype'
            },
            {
                $project: {
                    _id: 0,
                    'restaurant.name': 1,
                    'foodtype.imgId': 1,
                    'restaurant.note': 1,
                    'restaurant.images': { $arrayElemAt: ['$restaurant.images', 0] },
                    'restaurant._id': 1,
                }
            }
        ] as any[];
        let result = await collections.favorite?.aggregate(params).toArray();

        return result;
    }catch (error){
        throw error;
    }
}

async function getFavoriteExist (userId: string, restaurantId: string) : Promise<any> {
    try {
        let favorite = await collections.favorite?.findOne({userId: new ObjectId(userId), restaurantId: new ObjectId(restaurantId)});
        return favorite;
    }catch(error){
        throw error;
    }
}

export default {
    addFavorite,
    deleteFavorite,
    getFavoriteByUser,
    getFavoriteExist,
    deleteFavoriteByRestaurant,
    deleteFavoriteByUser
}as const;