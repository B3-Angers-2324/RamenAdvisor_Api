import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import AdminService from "../services/AdminService";
import jwt from "jsonwebtoken";
import OwnerServices from "../services/OwnerService";
import Owner from "../models/OwnerModel";
import { TRequest } from "./types/types";

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
        let ownerlist = await OwnerServices.getAll();
        console.log(ownerlist);
        res.status(HttpStatus.OK).json({"data": ownerlist});
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"error": error});
    }
}

async function validateOwner (req: TRequest, res: Response) {
    try{
        let id = req.token?._id;

        let updatedOwner : Owner = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            companyName: req.body.companyName,
            password: req.body.password,
            socialAdresse: req.body.socialAdresse,
            validate: !(req.body.validate)
        };

        const owner = await OwnerServices.getOwnerById(id);
        if(owner){
            const result = await OwnerServices.updateOwner(id, updatedOwner);
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
    validateOwner
};