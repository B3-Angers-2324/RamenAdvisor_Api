import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { collections } from '../../src/services/Database';
import { MongoClient, Collection, Document } from 'mongodb';

const mongod = MongoMemoryServer.create();

export const connect = async () => {
   const uri = await (await mongod).getUri();
   await mongoose.connect(uri);
}

export const closeDatabase = async () => {
   await mongoose.connection.dropDatabase();
   await mongoose.connection.close();
   await (await mongod).stop();
}

export const clearDatabase = async () => {
   const collections = mongoose.connection.collections;
   for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
   }
}

// add owner collection to database and add 1 owner to it
export const addDatasToCollection = async (bddCollection: any, datas: any) => {
   for (const data of datas) {
      await bddCollection.insertOne(data);
   }
}