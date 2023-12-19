import { Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { TRequest } from '../controllers/types/types';
import OwnerService from '../services/OwnerService';
dotenv.config();

const ownerLoginMiddleware = async (req: TRequest, res: Response, next: NextFunction) => {
    // check if owner is logged in and change condition
    try{
        const token = req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new Error("No token provided");
        }

        const secret = process.env.JWT_SECRET_OWNER || "ASecretPhrase";
        const decode = jwt.verify(token, secret);

        (req as any).token = decode;

        const exist = await OwnerService.isRightToken(req.token?._id, token)
        if(!exist){
            throw new Error("Wrong token");
        }

        const isBan = await OwnerService.isBan(req.token?._id);
        if(isBan){
            throw new Error("You are banned");
        }

        const isValidate = await OwnerService.isValidate(req.token?._id);
        if(!isValidate){
            res.status(HttpStatus.I_AM_A_TEAPOT).json({"message": "Your account is being validated"});
            return;
        }

        next();
    }catch(error){
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    ownerLoginMiddleware,
};