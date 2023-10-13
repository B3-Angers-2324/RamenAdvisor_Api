import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";

const login = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({"message": "login admin route"});
}

const defaultFunction = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({"message": "Default admin route"});
}


export default {
    login,
    defaultFunction
};