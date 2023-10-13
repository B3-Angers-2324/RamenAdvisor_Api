import { ObjectId } from 'mongodb';

export default class Restaurant{
    constructor(
        public name: string,
        public address: string,
        public note: number,
        public id?: ObjectId,
    ){}
}