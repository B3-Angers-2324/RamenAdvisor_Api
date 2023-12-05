import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import AdminService from "../services/AdminService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ModeratorService from "../services/ModeratorService";
import { TRequest } from "./types/types";
dotenv.config();

async function login(req: Request, res: Response){
    try{
        //check if its a moderator
        const moderator = await ModeratorService.getOneUser(req.body.email);
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
    console.log("user route called", req.token, req.admin);

    // TODO: add the content of the navbar

    const responseData: { [key: string]: any } = {
        // add all data to send to the front
    }

    if(req.admin){
        responseData["ad"] = true;
    }
    res.status(HttpStatus.OK).json(responseData);
};

export default {
    login,
    nav
};