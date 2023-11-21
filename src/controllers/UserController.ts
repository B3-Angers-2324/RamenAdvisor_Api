import { Request, Response } from "express";
import { TRequest } from "../controllers/types/types";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import UserServices from "../services/UserService";
import HttpStatus from "../constants/HttpStatus";
import dotenv from 'dotenv';
dotenv.config();

async function login(req: Request, res: Response){
    try{
        // check if email and password are provided if not return 400

        if (!req.body.email || !req.body.password) throw new Error("Email and password are required");
        const user = await UserServices.getOneUser(req.body.email);
        if(user){
            if(user.password === req.body.password){
                const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
                const token = jwt.sign({_id: user._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                res.status(HttpStatus.OK).json({"token": token});
            }else{
                throw new Error("Wrong password");
            }
        }else{
            throw new Error("User not found");
        }
    }catch(error : Error|any){
        switch(error.message) {
            case "Email and password are required":
                res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
                break;
            case "Wrong password":
                res.status(HttpStatus.UNAUTHORIZED).json({"message": error.message});
                break;
            case "User not found":
                res.status(HttpStatus.NOT_FOUND).json({"message": error.message});
                break;
            default:
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while logging in"});
        }
    }
}

async function register(req: Request, res: Response){
    try{
        //check if all fields are provided if not return 400
        if (!req.body.firstName || !req.body.lastName || !req.body.birthDay || !req.body.email || !req.body.phone || !req.body.sexe || !req.body.ville || !req.body.address || !req.body.password) throw new Error("All fields are required");

        let newUser : User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDay: req.body.birthDay,
            email: req.body.email,
            phone: req.body.phone,
            sexe: req.body.sexe,
            ville: req.body.ville,
            address: req.body.address,
            password: req.body.password,
            image: "http://thispersondoesnotexist.com/",
            ban: false
        };

        if(!newUser.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            throw new Error("Email format is not correct");
        }

        const user = await UserServices.getOneUser(newUser.email);
        if(user){
            throw new Error("User already exists");
        }

        const addedUser = await UserServices.addUser(newUser);

        if(addedUser){
            const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
            const token = jwt.sign({_id: addedUser.insertedId?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
            res.status(HttpStatus.CREATED).json({"token": token});
        }else{
            throw new Error("Error while adding user");
        }
    }catch(error : Error|any){
        if (error.message === "All fields are required") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "Email format is not correct") res.status(HttpStatus.BAD_REQUEST).json({"message": error.message});
        else if (error.message === "User already exists") res.status(HttpStatus.CONFLICT).json({"message": error.message});
        else res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while adding user, check if all fields are correct"});
    }
}

async function getAll(req: TRequest, res: Response){
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
    register,
    getAll,
    defaultFunction
};