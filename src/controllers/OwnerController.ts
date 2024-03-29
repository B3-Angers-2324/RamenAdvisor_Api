import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import jwt from "jsonwebtoken";
import OwnerServices from "../services/OwnerService";
import Owner from "../models/OwnerModel";
import dotenv from 'dotenv';
import RestaurantService from "../services/RestaurantService";
import { TRequest } from "./types/types";
import CheckInput from "../tools/CheckInput";
import MessageService from "../services/MessageService";
import ImageContoller from "./ImageContoller";
import FavoriteService from "../services/FavoriteService";
dotenv.config();

async function login(req: Request, res: Response){
    try{
        const owner = await OwnerServices.getOneOwner(req.body.email);
        if(owner){
            if(owner.password == req.body.password){

                const isBan = await OwnerServices.isBan(owner._id?.toString());
                if(isBan){
                    res.status(HttpStatus.UNAUTHORIZED).json({"message": "You are banned"});
                    return;
                }

                // const isValidate = await OwnerServices.isValidate(owner._id?.toString());
                // if(!isValidate){
                //     res.status(HttpStatus.UNAUTHORIZED).json({"message": "Your account is being validated"});
                //     return;
                // }

                const secret = process.env.JWT_SECRET_OWNER || "ASecretPhrase";
                const token = jwt.sign({_id: owner._id?.toString()}, secret, {expiresIn: process.env.JWT_EXPIRES_IN});
                await OwnerServices.updateToken(req.body.email, token);
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
            socialAdresse: req.body.socialAdresse,
            validate: false
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
            await OwnerServices.updateToken(newOwner.email, token);
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

async function getAllOwner (req: TRequest, res: Response) {
    try{
        let ownerlist = await OwnerServices.getAll();
        res.status(HttpStatus.OK).json({"data": ownerlist});
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"error": error});
    }
}

async function getOwnerProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        const owner = await OwnerServices.getOwnerById(id);
        if(owner){
            res.status(HttpStatus.OK).json({"owner": owner});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "Owner not found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting owner information"});
    }
}

async function updateOwnerProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id;
        // check if all fields are not empty
        if(!CheckInput.areNotEmpty([req.body.firstName, req.body.lastName, req.body.email, req.body.companyName, req.body.password, req.body.siret, req.body.socialAdresse])){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Missing parameters"});
            return;
        }
        // check if phone number is valid
        if(!CheckInput.phone(req.body.phone)){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid phone number"});
            return;
        }
        // check if email is valid
        if(!CheckInput.email(req.body.email)){
            res.status(HttpStatus.BAD_REQUEST).json({"message": "Email format is not correct"});
            return;
        }

        let updatedOwner : Owner = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            companyName: req.body.companyName,
            password: req.body.password,
            socialAdresse: req.body.socialAdresse,
            validate: req.body.validate
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

async function deleteOwnerProfileContent(id: string, res: Response){
    //get all restaurants of the owner
    const restaurants = await RestaurantService.queryRestaurantsByOwner(id);

    // delete all messages and images of the restaurants
    restaurants.forEach(async (element) => {
        // delete all messages of the restaurant
        await MessageService.deleteAllMessagesForRestaurant(element._id?.toString() || "");

        // delete all images of the restaurant
        if(element.images.length > 0){
            // delete all images
            for(let i = 0; i < element.images.length; i++){
                if(element.images[i] != "" && element.images[i] != undefined){
                    await ImageContoller.deleteImage(element.images[i]);
                }
            }
        }

        // delete all favorite of the restaurant
        await FavoriteService.deleteFavoriteByRestaurant(element._id?.toString() || "");
    });

    // delete all restaurants of the owner
    await RestaurantService.deleteAllRestaurantsByOwner(id);
    // delete the owner
    const result = await OwnerServices.deleteOwner(id);
    if(result){
        res.status(HttpStatus.OK).json({"message": "Owner deleted"});
    }else{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting owner"});
    }
}

async function deleteOwnerProfile(req: TRequest, res: Response){
    try{
        let id = req.token?._id || "";
        
        deleteOwnerProfileContent(id, res);
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while deleting owner"});
    }
}


export default {
    login,
    register,
    getRestaurantsByOwner,
    getOwnerProfile,
    updateOwnerProfile,
    deleteOwnerProfile,
    getAllOwner,
    deleteOwnerProfileContent
};