import { Request, Response, query } from "express";
import HttpStatus from "../constants/HttpStatus";
import FoodtypeService from "../services/FoodtypeService";
import { CustomError, TRequest } from "./types/types";
import AdminMiddleware from "../middleware/AdminMiddleware";
import FoodtypeModel from "../models/FoodtypeModel";
import { ObjectId } from "mongodb";
import ImageContoller from "./ImageContoller";

const fs = require('fs');

async function getAll(req: Request, res: Response){
    try{
        const result = await FoodtypeService.queryAll();
        res.status(HttpStatus.OK).json(result);
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    } 
}


async function addFoodtype(req: TRequest, res: Response){
    AdminMiddleware.adminLoginMiddleware(req, res, async () => { 
        if(req.file){
            try{
                // add image to database
                ImageContoller.addImage(req.file.buffer, req.file.mimetype).then((imageId) => {
                    // add foodtype to database
                    let foodtype = {
                        name: req.body.name,
                        imgId: new ObjectId(imageId)
                    }
                
                    const result = FoodtypeService.addFoodtype(foodtype as unknown as FoodtypeModel);
                    res.status(HttpStatus.OK).json(result);
                }).catch((error) => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
                });
            }catch(error){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
            }
            res.status(HttpStatus.OK);
        }
    });
}

async function deleteFoodtype(req: TRequest, res: Response){
    AdminMiddleware.adminLoginMiddleware(req, res, async () => { 
        try{
            if(!req.admin) throw new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED);

            // delete image from database
            const foodtype = await FoodtypeService.queryFoodtypeById(req.params.id);
            if(foodtype.imgId){
                ImageContoller.deleteImage(foodtype.imgId.toString());
            }


            // delete foodtype from database
            const result = await FoodtypeService.deleteFoodtype(req.params.id);
            res.status(HttpStatus.OK).json(result);
        }catch(error: CustomError | any){
            res.status(error.code? error.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": error.code? error.message : "Error while deleting foodtype"});
        }
    });
}

export default{
    getAll,
    addFoodtype,
    deleteFoodtype
}