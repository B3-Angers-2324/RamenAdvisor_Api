import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import AdminService from "../services/AdminService";
import jwt from "jsonwebtoken";
import OwnerServices from "../services/OwnerService";
import Owner from "../models/OwnerModel";
import { CustomError, TRequest } from "./types/types";
import RestaurantService from "../services/RestaurantService";


async function login(req: Request, res: Response){
    try{
        const admin = await AdminService.getOneUser(req.body.email);
        if(admin){
            if(admin.password === req.body.password){
                const secret = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";
                const token = jwt.sign({_id: admin._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
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

async function getOwnerNoValidate (req: TRequest, res: Response) {
    try{
        let owners = await OwnerServices.queryOwnerNoValidate();
        if(owners){
            res.status(HttpStatus.OK).json({"owners": owners});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "No unvalidate owners found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting owners"});
    }
}

async function getAllOwner (req: TRequest, res: Response) {
    try{
        let owners = await OwnerServices.getAll();
        if(owners){
            res.status(HttpStatus.OK).json({"owners": owners});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "No owners found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting owners"});
    }
}

async function validateOwner (req: TRequest, res: Response) {
    try{
        let id = req.params.uid;
        const owner = await OwnerServices.getOwnerById(id);
        owner.validate = true;

        if(owner){
            const result = await OwnerServices.updateOwner(id, owner);
            if(result){
                res.status(HttpStatus.OK).json({"message": "Owner information updated"});
            }else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating owner information"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "Owner not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating owner information"});
    }
}

async function getOwnerProfile(req: TRequest, res: Response){
    //Just forwards the request to the user controller with the right id
    try{
        const ownerId = req.params.uid;
        if (ownerId == "" || ownerId == undefined) throw new CustomError("No user id provided", HttpStatus.BAD_REQUEST);
        let owner = await OwnerServices.getOwnerById(ownerId);
        if (owner == null) throw new CustomError("No user found", HttpStatus.NOT_FOUND);
        res.status(HttpStatus.OK).json(owner);
    }catch(error : CustomError | any){
        res.status(error.code? error.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": error.code? error.message : "Error while getting owners"});
    }
}

async function getRestaurantsByOwner(req: TRequest, res: Response){
    try{
        let id = req.params?.uid;
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

async function banOwner (req: TRequest, res: Response) {
    try{
        let id = req.params.uid;
        const owner = await OwnerServices.getOwnerById(id);
        owner.ban = true;

        if(owner){
            const result = await OwnerServices.updateOwner(id, owner);
            if(result){
                res.status(HttpStatus.OK).json({"message": "Owner information updated"});
            }else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating owner information"});
            }
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "Owner not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while updating owner information"});
    }
}


export default {
    login,
    getOwnerNoValidate,
    getAllOwner,
    validateOwner,
    getOwnerProfile,
    getRestaurantsByOwner,
    banOwner
};