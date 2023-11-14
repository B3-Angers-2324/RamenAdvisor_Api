import { ObjectId } from 'mongodb';

export default class Restaurant{
    constructor(
        public name: string,
        public address: string,
        public note: number, //--
        public position: any,
        public image: string,
        public foodtype: string,
        public id?: ObjectId,
        public city?: string,
        public ownerId?: ObjectId,
        public tel?: string,
        public web?: string,
        public email?: string,
        public terrasse?: boolean,
        public handicape?: boolean,
    ){}
}