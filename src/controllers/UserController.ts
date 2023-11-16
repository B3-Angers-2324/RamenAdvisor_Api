import { Request, Response } from "express";
import { TRequest } from "../controllers/types/types";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import UserServices from "../services/UserService";
import HttpStatus from "../constants/HttpStatus";
import CheckInput from "../tools/CheckInput";
import dotenv from 'dotenv';
dotenv.config();

async function login(req: Request, res: Response){
    try{
        const user = await UserServices.getOneUser(req.body.email);
        if(user){
            if(user.password === req.body.password){
                const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
                const token = jwt.sign({_id: user._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                res.status(HttpStatus.OK).json({"token": token});
            }else{
                res.status(HttpStatus.UNAUTHORIZED).json({"message": "Wrong password"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while logging in"});
    }
}

async function register(req: Request, res: Response){
    try{
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
            ban: false
        };

        if(!newUser.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Email format is not correct"});
            return;
        }

        const user = await UserServices.getOneUser(newUser.email);
        if(user){
            res.status(HttpStatus.CONFLICT).json({"message": "User already exists"});
            return;
        }

        const addedUser = await UserServices.addUser(newUser);

        if(addedUser){
            const secret = process.env.JWT_SECRET_USER || "ASecretPhrase";
            const token = jwt.sign({_id: addedUser.insertedId?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
            res.status(HttpStatus.CREATED).json({"token": token});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while adding user"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while adding user, check if all fields are correct"});
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

async function getUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        const user = await UserServices.getUserById(id);
        if(user){
            res.status(HttpStatus.OK).json({"user": user});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting user information"});
    }
}

async function updateUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        // check if all fields are not empty
        if(!CheckInput.areNotEmpty([req.body.firstName, req.body.lastName, req.body.birthDay, req.body.email, req.body.phone, req.body.sexe, req.body.ville, req.body.address])){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Missing parameters"});
            return;
        }
        // check if phone number is valid
        if(CheckInput.phone(req.body.phone) == null){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid phone number"});
            return;
        }
        // check if email is valid
        if(CheckInput.email(req.body.email) == null){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Email format is not correct"});
            return;
        }

        let updatedUser : User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDay: req.body.birthDay,
            email: req.body.email,
            phone: req.body.phone,
            sexe: req.body.sexe,
            ville: req.body.ville,
            address: req.body.address,
        };

        const user = await UserServices.getUserById(id);
        if(user){
            const result = await UserServices.updateUser(id, updatedUser);
            if(result){
                res.status(HttpStatus.OK).json({"message": "User information updated"});
            }else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating user information"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "User not found"});
        }
    }catch(error){
        console.log(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating user information"});
    }
}

async function deleteUserProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        const result = await UserServices.deleteUser(id);
        if(result){
            res.status(HttpStatus.OK).json({"message": "User deleted"});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting user"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting user"});
    }
}


export default {
    login,
    register,
    getAll,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};