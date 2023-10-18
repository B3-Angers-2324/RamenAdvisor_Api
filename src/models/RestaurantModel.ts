import { ObjectId } from 'mongodb';

export default class Restaurant{
    constructor(
        public name: string,
        public address: string,
        public note: number,
        public position: any,
        public image: string,
        public foodtype: string,
        public id?: ObjectId,
    ){}
}