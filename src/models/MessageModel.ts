import { ObjectId } from 'mongodb';

export default class Message{
    constructor(
        public userId: ObjectId,
        public restaurantId: ObjectId,
        public message: string,
        public note: number,
        public id?: ObjectId,
    ){}
}