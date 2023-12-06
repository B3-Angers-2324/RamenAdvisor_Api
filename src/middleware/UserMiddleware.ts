import { Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { TRequest } from '../controllers/types/types';
import UserService from '../services/UserService';
dotenv.config();

const userLoginMiddleware = async (req: TRequest, res: Response, next: NextFunction) => {
    // check if user is logged in and change condition
    try{
        const token = req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new Error("No token provided");
        }

        const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
        const decode = jwt.verify(token, secret);

        (req as any).token = decode;

        const exist = await UserService.isRightToken(req.token?._id, token)
        if(!exist){
            throw new Error("Wrong token");
        }

        const isBan = await UserService.isBan(req.token?._id);
        if(isBan){
            throw new Error("You are banned");
        }

        next();
    }catch(error){
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    userLoginMiddleware,
};