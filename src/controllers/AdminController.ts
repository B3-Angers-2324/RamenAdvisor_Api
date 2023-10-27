import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";

async function login(req: Request, res: Response){
    res.status(HttpStatus.OK).json({"message": "login admin route"});
}

async function defaultFunction(req: Request, res: Response){
    res.status(HttpStatus.OK).json({"message": "Default admin route"});
}


export default {
    login,
    defaultFunction
};