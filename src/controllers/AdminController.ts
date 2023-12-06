import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import AdminService from "../services/AdminService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ModeratorService from "../services/ModeratorService";
import { CustomError, TRequest } from "./types/types";
import UserService from "../services/UserService";
import MessageService from "../services/MessageService";
import Moderator from "../models/ModeratorModel";
import CheckInput from "../tools/CheckInput";
dotenv.config();

async function login(req: Request, res: Response){
    try{
        //check if its a moderator
        const moderator = await ModeratorService.getOneModo(req.body.email);
        if(moderator){

            if(moderator.password === req.body.password){
                const secret_moderator = process.env.JWT_SECRET_MODO || "ASecretPhrase";
                const token = jwt.sign({_id: moderator._id?.toString(), moderator: true}, secret_moderator, {expiresIn: process.env.JWT_EXPIRES_IN});
                await ModeratorService.updateToken(req.body.email, token);
                res.status(HttpStatus.OK).json({"token": token});
            }else{
                res.status(HttpStatus.UNAUTHORIZED).json({"message": "Wrong password"});
            }

        }else{

            //check if its an admin
            const admin = await AdminService.getOneUser(req.body.email);
            if(admin){
                if(admin.password === req.body.password){
                    const secret_admin = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";
                    const token = jwt.sign({_id: admin._id?.toString(), moderator: true}, secret_admin, {expiresIn: process.env.JWT_EXPIRES_IN});
                    await AdminService.updateToken(req.body.email, token);
                    res.status(HttpStatus.OK).json({"token": token, "ad": true});
                }else{
                    res.status(HttpStatus.UNAUTHORIZED).json({"message": "Wrong password"});
                }
            }else{
                res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
            }

        }
        
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while logging in"});
    }
}

async function nav(req: TRequest, res: Response){

    // TODO: add the content of the navbar

    const responseData: { [key: string]: any } = {
        // add all data to send to the front
    }

    if(req.admin){
        responseData["ad"] = true;
    }
    res.status(HttpStatus.OK).json(responseData);
};


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
        const userId = req.params.uid;
        if (userId == "" || userId == undefined) throw new CustomError("No user id provided", HttpStatus.BAD_REQUEST);
        let user = await UserService.getUserById(userId);
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
        if (user == null) throw new CustomError("No user found", HttpStatus.NOT_FOUND);
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
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while banning user"});
    }
}

async function addModerator(req: TRequest, res: Response){
    try{
        if(!req.admin) throw new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED);

        if (req.body.email == undefined || req.body.password == undefined) throw new CustomError("Missing parameters", HttpStatus.BAD_REQUEST);
        const newModerator: Moderator = {
            email: req.body.email,
            password: req.body.password
        }

        // check if the email is valid
        if (!CheckInput.email(newModerator.email)) throw new CustomError("Invalid email", HttpStatus.BAD_REQUEST);

        // check if the password is valid
        // console.log(newModerator.password, CheckInput.password(newModerator.password || ""));
        // if (!newModerator.password || !CheckInput.password(newModerator.password)) throw new CustomError("Invalid password", HttpStatus.BAD_REQUEST);

        const admin = await AdminService.getOneUser(newModerator.email);
        if (admin != null) throw new CustomError("Admin already exists with this mail", HttpStatus.BAD_REQUEST);

        const moderator = await ModeratorService.getOneModo(newModerator.email);
        if (moderator != null) throw new CustomError("Moderator already exists with this mail", HttpStatus.BAD_REQUEST);

        const result = await ModeratorService.addModerator(newModerator);
        if (result == null) throw new CustomError("Error while adding moderator", HttpStatus.INTERNAL_SERVER_ERROR);

        res.status(HttpStatus.OK).json({"message": "Moderator added"});
    }catch(e: CustomError | any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while adding moderator"});
    }
}

async function deleteModerator(req: TRequest, res: Response){
    try{
        if(!req.admin) throw new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED);

        if (req.params.mid == undefined) throw new CustomError("Missing parameters", HttpStatus.BAD_REQUEST);

        const moderator = await ModeratorService.getOneModoById(req.params.mid);
        if (moderator == null) throw new CustomError("Moderator not found", HttpStatus.NOT_FOUND);

        const result = await ModeratorService.deleteModerator(req.params.mid);
        if (result == null) throw new CustomError("Error while deleting moderator", HttpStatus.INTERNAL_SERVER_ERROR);

        res.status(HttpStatus.OK).json({"message": "Moderator deleted"});
    }catch(e: CustomError | any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while deleting moderator"});
    }
}

async function getModerators(req: TRequest, res: Response){
    try{
        if(!req.admin) throw new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED);

        const moderators = await ModeratorService.getModerators();
        if (moderators == null) throw new CustomError("Error while getting moderators", HttpStatus.INTERNAL_SERVER_ERROR);

        res.status(HttpStatus.OK).json(moderators);
    }catch(e: CustomError | any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while getting moderators"});
    }
}


export default {
    login,
    nav,
    getUsers,
    getUserProfile,
    getUserMessage,
    banUser,
    addModerator,
    deleteModerator,
    getModerators
};