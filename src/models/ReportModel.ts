import { ObjectId, WithId } from 'mongodb';

export default class Report{
    constructor(
        public userId: ObjectId,
        public restaurantId: ObjectId,
        public messageId: ObjectId,
        public date_first: Date,
        public nbReport: number,
        public _id?: ObjectId,
    ){}
}