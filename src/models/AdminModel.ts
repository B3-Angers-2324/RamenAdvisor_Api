import { ObjectId } from 'mongodb';

export default class Admin{
    constructor(
        public email: string,
        public password?: string,
        public id?: ObjectId,
    ){}
}