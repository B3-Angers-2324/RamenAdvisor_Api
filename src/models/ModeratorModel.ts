import { ObjectId } from 'mongodb';

export default class Moderator{
    constructor(
        public password: string,
        public id?: ObjectId,
    ){}
}