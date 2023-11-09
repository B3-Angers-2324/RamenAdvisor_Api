import { Request, Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus"

const adminLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // check if admin is logged in and change condition
    if (req.query.admin === "true") {
        next();
    } else {
        res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    adminLoginMiddleware,
};