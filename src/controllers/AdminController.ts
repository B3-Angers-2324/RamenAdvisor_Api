import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import AdminService from "../services/AdminService";
import jwt from "jsonwebtoken";
import { CustomError, TRequest } from "./types/types";
import UserService from "../services/UserService";
import MessageService from "../services/MessageService";

async function login(req: Request, res: Response){
    try{
        const admin = await AdminService.getOneUser(req.body.email);
        if(admin){
            if(admin.password === req.body.password){
                const secret = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";
                const token = jwt.sign({_id: admin._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                res.status(HttpStatus.OK).json({"token": token});
            }else{
                res.status(HttpStatus.UNAUTHORIZED).json({"message": "Wrong password"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while logging in"});
    }
}

async function getUsers(req: TRequest, res: Response){
    try{
        //Check for the query parameters
        let firstName = req.query.firstName;
        let lastName = req.query.lastName;
        if((firstName == undefined || firstName === "") && (lastName == undefined || lastName === "")) throw new CustomError("names are required", HttpStatus.BAD_REQUEST);
        // make the right query
        let users;
        // @ts-ignore
        if (firstName == undefined || firstName === "") users = await UserService.getUsersByLastName(lastName);
        // @ts-ignore
        else if (lastName == undefined || lastName === "") users = await UserService.getUsersByFirstName(firstName);
        // @ts-ignore
        else users = await UserService.getUsersByFirstNameAndLastName(firstName, lastName);

        if(users.length > 0){
            res.status(HttpStatus.OK).json({
                number: users.length,
                users: users,
            });
        }else{
            throw new CustomError("No users found", HttpStatus.NOT_FOUND);
        }
    }catch(error: CustomError | any){
        res.status(error.code? error.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": error.code? error.message : "Error while getting users"});
    }
}

async function getUserProfile(req: TRequest, res: Response){
    //Just forwards the request to the user controller with the right id
    try{
        const userId = await UserService.getUserById(req.params.uid);
        if (userId == "" || userId == undefined) throw new CustomError("No user id provided", HttpStatus.BAD_REQUEST);
        let user = await UserService.getUserById(req.params.uid);
        if (user == null) throw new CustomError("No user found", HttpStatus.NOT_FOUND);
        res.status(HttpStatus.OK).json(user);
    }catch(error : CustomError | any){
        res.status(error.code? error.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": error.code? error.message : "Error while getting users"});
    }
}

async function getUserMessage(req: TRequest, res: Response){
    try{
        const userId = req.params.uid;
        if (userId == "" || userId == undefined) throw new CustomError("No user id provided", HttpStatus.BAD_REQUEST);
        const user = await UserService.getUserById(req.params.uid);
        if (req.query.limit == undefined || req.query.offset == undefined) throw new CustomError("Missing parameters", HttpStatus.BAD_REQUEST);
        let limit = parseInt(req.query.limit.toString());
        let offset = parseInt(req.query.offset.toString());
        let messages = await MessageService.queryMessagesForUser(user._id, limit+1, offset);
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
    }catch(e : CustomError | any){
        console.log(e);
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while getting users"});
    }
}

async function banUser(req: TRequest, res: Response){
    try{
        const userId = req.params.uid;
        if (userId == "" || userId == undefined) throw new CustomError("No user id provided", HttpStatus.BAD_REQUEST);
        const user = await UserService.getUserById(req.params.uid);
        if (user == null) throw new CustomError("No user found", HttpStatus.NOT_FOUND);
        user.ban = true;
        const result = await UserService.updateUser(user._id, user );
        if (result == null) throw new CustomError("Error while banning user", HttpStatus.INTERNAL_SERVER_ERROR);
        res.status(HttpStatus.OK).json({"message": "User banned"});
    }catch(e: CustomError | any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while getting users"});
    }
}


export default {
    login,
    getUsers,
    getUserProfile,
    getUserMessage,
    banUser
};