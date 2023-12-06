import { Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus"
import { TRequest } from '../controllers/types/types';
import AdminService from '../services/AdminService';
import ModeratorService from '../services/ModeratorService';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const adminLoginMiddleware = async (req: TRequest, res: Response, next: NextFunction) => {
    // check if admin is logged in and change condition
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new Error("No token provided");
        }

        try{
            // check if moderator is logged in
            const secret_moderator = process.env.JWT_SECRET_MODO || "ASecretPhrase";
            const decode = jwt.verify(token, secret_moderator);
            
            (req as any).token = decode;
            (req as any).admin = false;
        
            const exist = await ModeratorService.isRightToken(req.token?._id, token)
            if(!exist){
                throw new Error("Wrong moderator token");
            }

            next();
            return;
        }catch(e){}

        try{
            const secret_admin = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";
            const decode = jwt.verify(token, secret_admin);
            (req as any).token = decode;
            (req as any).admin = true;
    
            const exist = await AdminService.isRightToken(req.token?._id, token)
            if(!exist){
                throw new Error("Wrong admin token");
            }

            next();
            return;
        }catch(e){
            throw new Error("Wrong token");
        }
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    adminLoginMiddleware,
};