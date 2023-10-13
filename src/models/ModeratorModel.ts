import { ObjectId } from 'mongodb';

export default class Moderator{
    constructor(
        public firstName: string,
        public lastName: string,
        public password: string,
        public id?: ObjectId,
    ){}
}