import { ObjectId } from 'mongodb';
import { collections } from './Database';
import User from '../models/UserModel';

async function getOneUser(email: string): Promise<any> {
    const user = await collections.user?.findOne({email: email, ban: false});
    return user;
}

async function is_email_used(email: string){
    const user = await collections.user?.findOne({email: email});
    if (user != null){
        return true
    }
    return false
}

async function addUser(user: User): Promise<any> {
    const result = await collections.user?.insertOne(user);
    return result;
}

async function getAll(): Promise<User[]> {
    try {
        const users = await collections.user?.find({ban : false}).toArray();
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
        const user = await collections.user?.findOne({ _id: new ObjectId(id) , ban : false});
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
    const user = await collections.user?.findOne({_id: new ObjectId(id), ban : false});
    return user;
}

async function updateUser(id: string, user: User): Promise<any> {
    const result = await collections.user?.updateOne({_id: new ObjectId(id), ban : false}, {$set: user});
    return result;
}

async function updateUserPP(id: string, image: string): Promise<any> {
    const result = await collections.user?.updateOne({_id: new ObjectId(id)}, {$set: {image: new ObjectId(image)}});
    return result;
}

async function deleteUser(id: string): Promise<any> {
    const result = await collections.user?.deleteOne({_id: new ObjectId(id), ban : false});
    return result;
}

async function isRightToken(id: string, token: string): Promise<any> {
    // find one user with id and token
    const exist = await collections.user?.findOne({_id: new ObjectId(id), token: token, ban : false});
    return exist;
}

async function updateToken(email: string, token: string): Promise<any> {
    const result = await collections.user?.updateOne({email: email, ban : false}, {$set: {token: token}});
    return result;
}

async function getUsersByFirstName(firstName: string): Promise<any> {
    const user = await collections.user?.find({firstName: firstName, ban : false},{}).toArray();
    return user;
}

async function isBan(id: string): Promise<any> {
    const result = await collections.user?.findOne({_id: new ObjectId(id), ban: true});
    return result;
}

async function getUsersByLastName(lastName: string): Promise<any> {
    const user = await collections.user?.find({lastName: lastName, ban : false},{}).toArray();
    return user;
}

async function getUsersByFirstNameAndLastName(firstName: string, lastName: string): Promise<any> {
    const user = await collections.user?.find({lastName: lastName, firstName: firstName, ban : false},{}).toArray();
    return user;
}


export default {
    getOneUser,
    is_email_used,
    addUser,
    getAll,
    getOne,
    getUserById,
    updateUser,
    updateUserPP,
    deleteUser,
    isRightToken,
    updateToken,
    isBan,
    getUsersByFirstName,
    getUsersByLastName,
    getUsersByFirstNameAndLastName
} as const;