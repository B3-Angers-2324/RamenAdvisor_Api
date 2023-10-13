import { ObjectId } from 'mongodb';
import { collections } from './Database';
import User from '../models/UserModel';

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
    getAll
} as const;