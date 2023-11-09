import { Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { TRequest } from '../controllers/types/types';
dotenv.config();

const ownerLoginMiddleware = (req: TRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.replace("Bearer ", "");

        if(!token){
            res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
            return;
        }

        const secret = process.env.JWT_SECRET_OWNER || "ASecretPhrase";
        const decode = jwt.verify(token, secret);

        (req as any).token = decode;

        next();
    }catch(error){
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    ownerLoginMiddleware,
};