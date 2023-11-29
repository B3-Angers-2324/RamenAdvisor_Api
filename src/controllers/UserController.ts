import { Request, Response } from "express";
import { TRequest } from "../controllers/types/types";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import UserServices from "../services/UserService";
import HttpStatus from "../constants/HttpStatus";
import CheckInput from "../tools/CheckInput";
import dotenv from 'dotenv';
import MessageService from "../services/MessageService";
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
        // const messages = await MessageService.getAllMessagesForUser(id);
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

export default {
    login,
    register,
    getAll,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};