import { ObjectId } from 'mongodb';

export default class Moderator{
    constructor(
        public email: string,
        public password?: string,
        public id?: ObjectId,
    ){}
}