import { ObjectId } from 'mongodb';

export default class Owner{
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public companyName: string,
        public socialAdresse: string,
        public validate: boolean,
        public ban?: boolean,
        public id?: ObjectId,
        public siret?: string
    ){}
}