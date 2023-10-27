import { ObjectId } from 'mongodb';
import { collections } from './Database';
import User from '../models/UserModel';

async function getOneUser(email: string): Promise<any> {
    try{
        const user = await collections.user?.findOne({email: email});
        return user;
    }catch(error){
        throw error;
    }
}

async function addUser(user: User): Promise<any> {
    try{
        const result = await collections.user?.insertOne(user);
        return result
    }catch(error){
        throw error;
    }
}

async function getAll(): Promise<User[]> {
    try {
        const users = await collections.user?.find({}).toArray();
        if (users) {
            return users.map(element => new User(
                element.firstName,
                element.lastName,
                element.brithDay,
                element.email,
                element.phone,
                element.sexe,
                element.password,
                element.ville,
                element.ban,
                element._id
            ));
        } else {
            return [];
        }
    } catch (err) {
        throw err;
    }
}

export default {
    getOneUser,
    addUser,
    getAll
} as const;