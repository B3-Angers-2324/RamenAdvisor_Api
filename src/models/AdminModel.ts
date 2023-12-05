import { ObjectId } from 'mongodb';

export default class Admin{
    constructor(
        public password: string,
        public id?: ObjectId,
    ){}
}