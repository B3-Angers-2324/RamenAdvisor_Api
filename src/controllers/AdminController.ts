import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import AdminService from "../services/AdminService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function login(req: Request, res: Response){
    try{
        const admin = await AdminService.getOneUser(req.body.email);
        if(admin){
            if(admin.password === req.body.password){
                const secret = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";
                const token = jwt.sign({_id: admin._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                await AdminService.updateToken(req.body.email, token);
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


export default {
    login
};