import * as mongoDB from 'mongodb';
import dotenv from 'dotenv';

export const collections: {
    restaurant?: mongoDB.Collection,
    owner?: mongoDB.Collection,
    user?: mongoDB.Collection,
    message?: mongoDB.Collection,
    moderator?: mongoDB.Collection,
    admin?: mongoDB.Collection,
    foodtype?: mongoDB.Collection,
} = {};

export async function connectToDatabase(){
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN || "");
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.DB_NAME || "");
    const restaurantCollection: mongoDB.Collection = db.collection("restaurants");
    const ownerCollection: mongoDB.Collection = db.collection("owners");
    const userCollection: mongoDB.Collection = db.collection("users");
    const messageCollection: mongoDB.Collection = db.collection("messages");
    const moderatorCollection: mongoDB.Collection = db.collection("moderators");
    const adminCollection: mongoDB.Collection = db.collection("admins");
    const foodtypeCollection: mongoDB.Collection = db.collection("foodtypes");

    collections.restaurant = restaurantCollection;
    collections.owner = ownerCollection;
    collections.user = userCollection;
    collections.message = messageCollection;
    collections.moderator = moderatorCollection;
    collections.admin = adminCollection;
    collections.foodtype = foodtypeCollection;

    console.log(`[Server]: Successfully connected to database: ${db.databaseName}`);
}