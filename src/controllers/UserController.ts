import { Request, Response } from "express";
import UserServices from "../services/UserService";
import HttpStatus from "../constants/HttpStatus";

async function login(req: Request, res: Response){
    res.status(HttpStatus.OK).json({"message": "Login user route"});
}

async function getAll(req: Request, res: Response){
    try{
        const userlist = await UserServices.getAll();
        res.status(HttpStatus.OK).json({"data": userlist});
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"error": error});
    }
}

async function defaultFunction(req: Request, res: Response){
    res.status(HttpStatus.OK).json({"message": "Default user route"});
}


export default {
    login,
    getAll,
    defaultFunction
};