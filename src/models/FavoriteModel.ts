import { ObjectId } from 'mongodb';

export default class Favorite{
    constructor(
        public userId?: ObjectId, 
        public restaurantId?: ObjectId,
    ){}
}