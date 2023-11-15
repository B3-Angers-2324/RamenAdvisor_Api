import { Request, Response, query } from "express";
import HttpStatus from "../constants/HttpStatus";
import Foodtype from "../services/FoodtypeService";
import { TRequest } from "./types/types";
import AdminbMiddleware from "../middleware/AdminMiddleware";
import FoodtypeModel from "../models/FoodtypeModel";
import { ObjectId } from "mongodb";

async function getAll(req: Request, res: Response){
    try{
        const result = await Foodtype.queryAllFoodtype();
        // convert buffer to base64
        let data: { _id: ObjectId; name: string; url: string; }[] = [];
        result.forEach((foodtype) => {
            foodtype.svg = foodtype.svg.toString('base64');
            // print size of svg
            console.log(foodtype.svg.length);
            data.push({
                _id: foodtype._id,
                name: foodtype.name,
                url: `data:${foodtype.mimetype};base64,${foodtype.svg}`
            });
        });
        res.status(HttpStatus.OK).json(data);
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    } 
}


async function addFoodtype(req: TRequest, res: Response){
    AdminbMiddleware.adminLoginMiddleware(req, res, async () => { 
        if(req.file){
            let data = {
                name: req.body.name,
                svg: req.file.buffer,
                mimetype: req.file.mimetype
            }
            
            try{
                const result = await Foodtype.addFoodtype(data as unknown as FoodtypeModel);
                res.status(HttpStatus.OK).json(result);
            }catch(error){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
            }
        }
    });
}

export default{
    getAll,
    addFoodtype
}