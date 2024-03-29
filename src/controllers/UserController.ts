import { Request, Response } from "express";
import { CustomError, TRequest } from "../controllers/types/types";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import UserServices from "../services/UserService";
import MessageService from "../services/MessageService";
import HttpStatus from "../constants/HttpStatus";
import CheckInput from "../tools/CheckInput";
import MessageController from "./MessageController";
import ImageContoller from "./ImageContoller";
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';
import FavoriteService from "../services/FavoriteService";
import Favorite from "../models/FavoriteModel";
dotenv.config();

async function login(req: Request, res: Response){
    try{
        // check if email and password are provided if not return 400

        if (!req.body.email || !req.body.password) throw new Error("Email and password are required");
        const user = await UserServices.getOneUser(req.body.email);
        if(user){
            if(user.password === req.body.password){

                const isBan = await UserServices.isBan(user._id?.toString());
                if(isBan){
                    throw new Error("You are banned");
                }

                const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
                const token = jwt.sign({_id: user._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                await UserServices.updateToken(req.body.email, token);
                res.status(HttpStatus.OK).json({"token": token});
            }else{
                throw new Error("Wrong password");
            }
        }else{
            throw new Error("User not found");
        }
    }catch(error : Error|any){
        switch(error.message) {
            case "Email and password are required":
                res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
                break;
            case "Wrong password":
                res.status(HttpStatus.UNAUTHORIZED).json({"message": error.message});
                break;
            case "User not found":
                res.status(HttpStatus.NOT_FOUND).json({"message": error.message});
                break;
            case "You are banned":
                res.status(HttpStatus.UNAUTHORIZED).json({"message": error.message});
                break;
            default:
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while logging in"});
        }
    }
}

async function register(req: Request, res: Response){
    try{
        //check if all fields are provided if not return 400
        if (!req.body.firstName || !req.body.lastName || !req.body.birthDay || !req.body.email || !req.body.phone || !req.body.sexe || !req.body.ville || !req.body.address || !req.body.password) throw new Error("All fields are required");

        if(!CheckInput.areNotEmpty([req.body.firstName, req.body.lastName, req.body.birthDay, req.body.email, req.body.phone, req.body.sexe, req.body.ville, req.body.address, req.body.password])) throw new Error("All fields are required");
        
        let newUser : User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDay: new Date(req.body.birthDay),
            email: req.body.email,
            phone: req.body.phone,
            sexe: req.body.sexe,
            ville: req.body.ville,
            address: req.body.address,
            password: req.body.password,
            image: new ObjectId("000000000000000000000000"),
            ban: false
        };
        
        if(!CheckInput.email(newUser.email)) throw new Error("Email format is not correct");
        
        // if (!CheckInput.password(newUser.password || "")) throw new Error("Password format is not correct");
        
        if (!CheckInput.phone(newUser.phone)) throw new Error("Phone format is not correct");

        if(!CheckInput.dateInferiorToToday(newUser.birthDay)) throw new Error("Invalid birth day");

        if(!CheckInput.validDateFormat(req.body.birthDay)) throw new Error("Invalid birth day format");

        const mail_used = await UserServices.is_email_used(newUser.email);
        if(mail_used){
            throw new Error("User already exists");
        }
        const addedUser = await UserServices.addUser(newUser);
        
        if(addedUser){
            const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
            const token = jwt.sign({_id: addedUser.insertedId?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
            await UserServices.updateToken(req.body.email, token);
            res.status(HttpStatus.CREATED).json({"token": token});
        }else{
            throw new Error("Error while adding user");
        }
    }catch(error : Error|any){
        if (error.message === "All fields are required") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "Email format is not correct") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "Password format is not correct") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "Phone format is not correct") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "Invalid birth day") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "User already exists") res.status(HttpStatus.CONFLICT).json({"message": error.message});
        else res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while adding user, check if all fields are correct"});
    }
}

async function getAll(req: TRequest, res: Response){
    try{
        const userlist = await UserServices.getAll();
        res.status(HttpStatus.OK).json({"data": userlist});
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"error": error});
    }
}

async function getUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        const user = await UserServices.getUserById(id);
        if(user){
            res.status(HttpStatus.OK).json({"user": user});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting user information"});
    }
}

async function updateUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        // check if all fields are not empty
        if(!CheckInput.areNotEmpty([req.body.firstName, req.body.lastName, req.body.birthDay, req.body.email, req.body.phone, req.body.sexe, req.body.ville, req.body.address])){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Missing parameters"});
            return;
        }
        // check if phone number is valid
        if(!CheckInput.phone(req.body.phone)){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid phone number"});
            return;
        }
        // check if email is valid
        if(!CheckInput.email(req.body.email)){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Email format is not correct"});
            return;
        }

        if(!CheckInput.dateInferiorToToday(new Date(req.body.birthDay))){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid birth day"});
            return;
        }

        if(!CheckInput.validDateFormat(req.body.birthDay)){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid birth day format"});
            return;
        }

        let updatedUser : User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDay: new Date(req.body.birthDay),
            email: req.body.email,
            phone: req.body.phone,
            sexe: req.body.sexe,
            ville: req.body.ville,
            address: req.body.address,
        };

        const user = await UserServices.getUserById(id);
        if(user){
            const result = await UserServices.updateUser(id, updatedUser);
            if(result){
                res.status(HttpStatus.OK).json({"message": "User information updated"});
            }else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating user information"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating user information"});
    }
}

async function removeAllUserMessages(id: string){
    // get all messages from user
    const messages = await MessageService.queryMessagesForUser(id, 99999999, 0);
    if(messages == undefined){
        throw new CustomError("Error while retriving user Messages", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // recalculate note for each restaurant
    for(let message of messages){
        // TODO : could be optimized
        const note = await MessageController.deleteNotePercentage(message.restaurant._id.toString(), message.note);
    }

    // delete all messages from user
    const messagesDeleted = await MessageService.deleteAllMessagesForUser(id);
    if(!messagesDeleted){
        throw new CustomError("Error while deleting messages", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
}

async function deleteUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;

        // delete profile picture
        const user = await UserServices.getUserById(id);
        if(user){
            if(user.image.toString() != "000000000000000000000000"){
                // delete old profile picture
                const result = await ImageContoller.deleteImage(user.image.toString());
                if(!result){
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
                    return;
                }
            }
        }

        // delete all messages from user
        removeAllUserMessages(id);

        // delete all favorites from user
        await FavoriteService.deleteFavoriteByUser(id);

        // delete user
        const result = await UserServices.deleteUser(id);
        if(result){
            res.status(HttpStatus.OK).json({"message": "User deleted"});
        }else{
            throw new CustomError("Error while deleting user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }catch(error : CustomError | any){
        console.log(error);
        res.status(error.code? error.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": error.message? error.message : "Internal server error"});
    }
}

async function getUserMessage(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        if (req.query.limit == undefined || req.query.offset == undefined) throw new CustomError("Missing parameters", HttpStatus.BAD_REQUEST);
        let limit = parseInt(req.query.limit.toString());
        let offset = parseInt(req.query.offset.toString());
        let messages = await MessageService.queryMessagesForUser(id, limit+1, offset);
        if(messages == undefined) throw new CustomError("No message found", HttpStatus.NOT_FOUND);
        // check if there is more messages
        let more = false;
        if (messages.length > limit) {
            messages.pop();
            more = true;
        }
        res.status(HttpStatus.OK).json({
            length: messages.length,
            messages: messages,
            more: more
        });
    }catch(error : CustomError | any){
        res.status(error.code? error.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": error.message? error.message : "Internal server error"});
    }
}

async function updateUserPP(req: TRequest, res: Response){
    if(req.file){
        try{
            // test if the image is a jpeg or png or jpg
            if(!CheckInput.isImage(req.file.mimetype)){
                res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid image format (jpg, jpeg, png, gif)"});
                return;
            }

            // test if the image is under 15Mo
            if(!CheckInput.isUnder15Mo(req.file.size)){
                res.status(HttpStatus.BAD_REQUEST).json({"message": "Image is too big (max 15Mo)"});
                return;
            }


            // test if user already has a profile picture (image = 000000000000000000000000)
            const user = await UserServices.getUserById(req.token?._id);
            if(user){
                if(user.image.toString() != "000000000000000000000000"){
                    // delete old profile picture
                    const result = await ImageContoller.deleteImage(user.image.toString());
                    if(!result){
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
                        return;
                    }
                }
            }

            // add image to database
            ImageContoller.addImage(req.file.buffer, req.file.mimetype).then((imageId) => {
            
                const result = UserServices.updateUserPP(req.token?._id, imageId);
                res.status(HttpStatus.OK).json(result);
            }).catch((error) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
            });
        }catch(error){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
        res.status(HttpStatus.OK);
    }
}

async function getFavorite(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        let favorites = await FavoriteService.getFavoriteByUser(id);
        res.status(HttpStatus.OK).json(favorites);
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"error": error});
    }
    
}

async function toggleAddOrDeleteFavorite(req: TRequest, res: Response){
    try {
        let userId = req.token?._id;
        let restId = req.params.restId;

        let testFavorite = await FavoriteService.getFavoriteExist(userId, restId);
        if (testFavorite == null) {
            let newFavorite : Favorite = {
                userId: new ObjectId(userId), 
                restaurantId: new ObjectId(restId)
            }
            await FavoriteService.addFavorite(newFavorite);
            res.status(HttpStatus.OK).json({data: "add"})
        }
        else {
            await FavoriteService.deleteFavorite(userId, restId);
            res.status(HttpStatus.OK).json({data: "remove"})
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    }
}

async function getOneFavorite (req: TRequest, res: Response) {
    try {   
        let favorite = await FavoriteService.getFavoriteExist(req.token?._id, req.params.restId);
        if (favorite != null){
            res.status(HttpStatus.OK).json({data: "liked"})
        }
        else {
            res.status(HttpStatus.OK).json({data: "unliked"})
        }
    }catch (error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    }
}

export default {
    login, 
    register,
    getAll,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getFavorite, 
    toggleAddOrDeleteFavorite,
    getUserMessage,
    updateUserPP,
    removeAllUserMessages,
    getOneFavorite
};