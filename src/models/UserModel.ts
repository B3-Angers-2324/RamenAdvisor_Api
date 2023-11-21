import { ObjectId } from 'mongodb';

export default class User{
    constructor(
        public firstName: string,
        public lastName: string,
        public birthDay: Date,
        public email: string,
        public phone: string,
        public sexe: string,
        public password: string,
        public ban: boolean,
        public image: string,
        public ville?: string,
        public address?: string,
        public _id?: ObjectId,
    ){}
}