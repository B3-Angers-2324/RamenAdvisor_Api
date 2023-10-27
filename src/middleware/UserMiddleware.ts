import { Request, Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { TRequest } from '../routes/types/types';
dotenv.config();


const userLoginMiddleware = (req: TRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.replace("Bearer ", "");

        if(!token){
            res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
            return;
        }

        const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
        const decode = jwt.verify(token, secret);

        (req as any).token = decode;

        next();
    }catch(error){
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    userLoginMiddleware,
};