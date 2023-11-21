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
                element.address,
                element.ban,
                element._id.toString()
            ));
        } else {
            return [];
        }
    } catch (err) {
        throw err;
    }
}

async function getOne(id: string): Promise<User | null> {
    try {
        const user = await collections.user?.findOne({ _id: new ObjectId(id) });
        if (user) {
            return new User(
                user.firstName,
                user.lastName,
                user.brithDay,
                user.email,
                user.phone,
                user.sexe,
                user.password,
                user.ville,
                user.address,
                user.ban,
                user._id.toString()
            );
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }

}

export default {
    getOneUser,
    addUser,
    getAll,
    getOne
} as const;