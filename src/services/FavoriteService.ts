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
                $project: {
                    _id: 0,
                    'restaurant.name': 1,
                    'restaurant.type': 1,
                    'restaurant.note': 1 
                }
            }
        ] as any[];
        let result = await collections.favorite?.aggregate(params).toArray();

        return result;
    }catch (error){
        throw error;
    }
}

export default {
    addFavorite,
    getFavoriteByUser
}as const;