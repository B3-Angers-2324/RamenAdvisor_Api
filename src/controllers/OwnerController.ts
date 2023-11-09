import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import jwt from "jsonwebtoken";
import OwnerServices from "../services/OwnerService";
import Owner from "../models/OwnerModel";
import dotenv from 'dotenv';
import RestaurantService from "../services/RestaurantService";
import { TRequest } from "./types/types";
dotenv.config();

async function login(req: Request, res: Response){
    try{
        const owner = await OwnerServices.getOneOwner(req.body.email);
        if(owner){
            if(owner.password == req.body.password){
                const secret = process.env.JWT_SECRET_OWNER || "ASecretPhrase";
                const token = jwt.sign({_id: owner._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                res.status(HttpStatus.OK).json({"token": token});
            }else{
                res.status(HttpStatus.UNAUTHORIZED).json({"message": "Wrong password"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "Owner not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while logging in"});
    }
}

async function register(req: Request, res: Response){
    try{
        let newOwner : Owner = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            companyName: req.body.companyName,
            password: req.body.password,
            siret: req.body.siret,
            socialAdresse: req.body.socialAdresse
        };

        if(!newOwner.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Email format is not correct"});
            return;
        }

        const owner = await OwnerServices.getOneOwner(newOwner.email);
        if(owner){
            res.status(HttpStatus.CONFLICT).json({"message": "Owner already exists"});
            return;
        }

        const addedOwner = await OwnerServices.addOwner(newOwner);


        if(addedOwner){
            const secret = process.env.JWT_SECRET_OWNER || "ASecretPhrase";
            const token = jwt.sign({_id: addedOwner.insertedId?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
            res.status(HttpStatus.CREATED).json({"token": token});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while adding owner"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while adding owner, check if all fields are correct"});
    }
}

async function getRestaurantsByOwner(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        const restaurants = await RestaurantService.queryRestaurantsByOwner(id);
        if(restaurants){
            res.status(HttpStatus.OK).json({"restaurants": restaurants});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "No restaurant found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting restaurants"});
    }
}


export default {
    login,
    register,
    getRestaurantsByOwner,
};