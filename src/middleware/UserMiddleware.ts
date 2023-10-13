import { Request, Response, NextFunction } from 'express';
import HttpStatus from "../constants/HttpStatus";

const userLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("User login middleware");
    // check if admin is logged in and change condition
    if (req.query.user === "true") {
        next();
    } else {
        next();
        //res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are not authorized to view this page"});
    }
}

export default {
    userLoginMiddleware,
};