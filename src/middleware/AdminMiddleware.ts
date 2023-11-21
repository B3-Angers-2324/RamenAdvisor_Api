import { Request, Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus"
import { TRequest } from '../controllers/types/types';
import jwt from "jsonwebtoken";

const adminLoginMiddleware = (req: TRequest, res: Response, next: NextFunction) => {
    // check if admin is logged in and change condition
    try{
        const token = req.headers.authorization?.replace("Bearer ", "");

        if(!token){
            throw new Error("No token provided");
        }

        const secret = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";
        const decode = jwt.verify(token, secret);

        (req as any).token = decode;

        next();
    }catch(error){
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    adminLoginMiddleware,
};