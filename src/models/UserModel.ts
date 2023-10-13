import { ObjectId } from 'mongodb';

export default class User{
    constructor(
        public firstName: string,
        public lastName: string,
        public brithDay: Date,
        public email: string,
        public phone: string,
        public sexe: string,
        public password: string,
        public ville: string,
        public ban: boolean,
        public id?: ObjectId,
    ){}
}