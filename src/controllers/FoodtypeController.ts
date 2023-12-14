import { Request, Response, query } from "express";
import HttpStatus from "../constants/HttpStatus";
import FoodtypeService from "../services/FoodtypeService";
import { CustomError, TRequest } from "./types/types";
import AdminMiddleware from "../middleware/AdminMiddleware";
import FoodtypeModel from "../models/FoodtypeModel";
import { ObjectId } from "mongodb";
import ImageContoller from "./ImageContoller";
import CheckInput from "../tools/CheckInput";

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
                // check if image is an svg
                if(!CheckInput.isSvg(req.file.mimetype)){
                    throw new CustomError("Image must be an svg", HttpStatus.BAD_REQUEST);
                }

                // check if image is under 15Mo
                if(!CheckInput.isUnder15Mo(req.file.size)){
                    throw new CustomError("Image must be under 15Mo", HttpStatus.BAD_REQUEST);
                }


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
                    throw new CustomError("Error while adding image", HttpStatus.INTERNAL_SERVER_ERROR);
                });
            }catch(e : CustomError | any){
                res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.code? e.message : "Error while getting users"});
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