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

async function getUserById(id: string): Promise<any> {
    try{
        const user = await collections.user?.findOne({_id: new ObjectId(id)});
        return user;
    }catch(error){
        throw error;
    }

}

async function updateUser(id: string, user: User): Promise<any> {
    try{
        const result = await collections.user?.updateOne({_id: new ObjectId(id)}, {$set: user});
        return result;
    }catch(error){
        throw error;
    }
}

async function deleteUser(id: string): Promise<any> {
    try{
        const result = await collections.user?.deleteOne({_id: new ObjectId(id)});
        return result;
    }catch(error){
        throw error;
    }
}

async function isRightToken(id: string, token: string): Promise<any> {
    try{
        // find one user with id and token
        const exist = await collections.user?.findOne({_id: new ObjectId(id), token: token});
        return exist;
    }catch(error){
        throw error;
    }

}

async function updateToken(email: string, token: string): Promise<any> {
    try{
        const result = await collections.user?.updateOne({email: email}, {$set: {token: token}});
        return result;
    }
    catch(error){
        throw error;
    }
}

async function getUsersByFirstName(firstName: string): Promise<any> {
    try{
        const user = await collections.user?.find({firstName: firstName},{}).toArray();
        return user;
    }catch(error){
        throw error;
    }
}

async function isBan(id: string): Promise<any> {
    try{
        const result = await collections.user?.findOne({_id: new ObjectId(id), ban: true});
        return result;
    }
    catch(error){
        throw error;
    }
}

async function getUsersByLastName(lastName: string): Promise<any> {
    try{
        const user = await collections.user?.find({lastName: lastName},{}).toArray();
        return user;
    }catch(error){
        throw error;
    }
}

async function getUsersByFirstNameAndLastName(firstName: string, lastName: string): Promise<any> {
    try{
        const user = await collections.user?.find({lastName: lastName, firstName: firstName},{}).toArray();
        return user;
    }catch(error){
        throw error;
    }
}



export default {
    getOneUser,
    addUser,
    getAll,
    getOne,
    getUserById,
    updateUser,
    deleteUser,
    isRightToken,
    updateToken,
    isBan,
    getUsersByFirstName,
    getUsersByLastName,
    getUsersByFirstNameAndLastName
} as const;