import { ObjectId } from 'mongodb';

export default class Message{
    constructor(
        public userId: string,
        public restaurantId: string,
        public message: string,
        public note: number,
        public id?: ObjectId,
    ){}
}