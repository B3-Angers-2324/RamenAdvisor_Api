import { Request, Response } from "express";
import { CustomError, TRequest } from "../controllers/types/types";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import UserServices from "../services/UserService";
import MessageService from "../services/MessageService";
import HttpStatus from "../constants/HttpStatus";
import CheckInput from "../tools/CheckInput";
import MessageController from "./MessageController";
import dotenv from 'dotenv';
dotenv.config();

async function login(req: Request, res: Response){
    try{
        // check if email and password are provided if not return 400

        if (!req.body.email || !req.body.password) throw new Error("Email and password are required");
        const user = await UserServices.getOneUser(req.body.email);
        if(user){
            if(user.password === req.body.password){
                const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
                const token = jwt.sign({_id: user._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
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
            image: "http://thispersondoesnotexist.com/",
            ban: false
        };
        
        if(!CheckInput.email(newUser.email)) throw new Error("Email format is not correct");
        
        // if (!CheckInput.password(newUser.password || "")) throw new Error("Password format is not correct");
        
        if (!CheckInput.phone(newUser.phone)) throw new Error("Phone format is not correct");

        if(!CheckInput.dateInferiorToToday(newUser.birthDay)) throw new Error("Invalid birth day");

        const user = await UserServices.getOneUser(newUser.email);
        if(user){
            throw new Error("User already exists");
        }
        const addedUser = await UserServices.addUser(newUser);
        
        if(addedUser){
            const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
            const token = jwt.sign({_id: addedUser.insertedId?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
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

        let updatedUser : User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDay: new Date(req.body.birthDay),
            email: req.body.email,
            phone: req.body.phone,
            sexe: req.body.sexe,
            ville: req.body.ville,
            address: req.body.address,
            image: "http://thispersondoesnotexist.com/"
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

async function deleteUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        // get all messages from user
        const messages = await MessageService.queryMessagesForUser(id, 99999999, 0);
        if(messages == undefined){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting user"});
            return;
        }
        // recalculate note for each restaurant
        for(let message of messages){
            // TODO : could be optimized
            const note = await MessageController.deleteNotePercentage(message.restaurant._id.toString(), message.note);
            console.log(note);
        }


        // delete all messages from user
        const messagesDeleted = await MessageService.deleteAllMessagesForUser(id);
        if(!messagesDeleted){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting user"});
            return;
        }
        // delete user
        const result = await UserServices.deleteUser(id);
        if(result){
            res.status(HttpStatus.OK).json({"message": "User deleted"});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting user"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting user"});
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

export default {
    login,
    register,
    getAll,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUserMessage
};