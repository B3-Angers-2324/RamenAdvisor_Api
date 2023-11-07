import { ObjectId } from 'mongodb';

export default class Owner{
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public siret: string,
        public companyName: string,
        public socialAdresse: string,
        public id?: ObjectId,
    ){}
}