import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { collections } from '../../src/services/Database';
import { MongoClient, Collection, Document } from 'mongodb';

const mongod = MongoMemoryServer.create();


// db version mongoose
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



// db version mongoDB
export let database: any;
let client: any;

// connect function but for MongoDB
export const connectMongoDB = async () => {
   const uri = await (await mongod).getUri();
   client = new MongoClient(uri);
   await client.connect();
   // const db = client.db();
   // return db;
   database = client.db();
}

// closeDatabase function but for MongoDB
export const closeMongoDB = async () => {
   await database.dropDatabase();
   await client.close();
   await (await mongod).stop();
}

// clearDatabase function but for MongoDB
export const clearMongoDB = async () => {
   // remove all collections
   const collections = await database.collections();
   for (const collection of collections) {
      await collection.deleteMany({});
   }
}

// add owner collection to database and add 1 owner to it but for MongoDB
export const addDatasToMongoDB = async (collection: Collection, datas: any) => {
   for (const data of datas) {
      await collection.insertOne(data);
   }
}
