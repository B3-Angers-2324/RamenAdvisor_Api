import { Request, Response, query } from "express";
import HttpStatus from "../constants/HttpStatus";
import FoodtypeService from "../services/FoodtypeService";
import ImageService from "../services/ImageService";
import { TRequest } from "./types/types";
import AdminMiddleware from "../middleware/AdminMiddleware";
import FoodtypeModel from "../models/FoodtypeModel";
import ImageModel from "../models/ImageModel";
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

// async function getFoodtype(req: Request, res: Response){
//     try{
//         const result = await FoodtypeService.queryFoodtype(req.params.name);
//         // convert result.svg type object to a buffer
//         result.svg = result.svg.buffer;
//         res.writeHead(200, {
//             'Content-Type': result.mimetype,
//             'Content-Length': result.svg.length,
//             'X-Name': result.name,
//             'Access-Control-Expose-Headers': 'X-Name'
//         });
//         res.end(result.svg, "binary");

//     }catch(error){
//         console.log(error);
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal servers error"});
//     }
// }


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
                
                // // add foodtype to database
                // let foodtype = {
                //     name: req.body.name,
                //     imgId: imageResult.insertedId
                // }
            
                // const result = await FoodtypeService.addFoodtype(foodtype as unknown as FoodtypeModel);
                // res.status(HttpStatus.OK).json(result);
            }catch(error){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
            }
            res.status(HttpStatus.OK);
        }
    });
}

export default{
    getAll,
    addFoodtype,
    // getFoodtype
}