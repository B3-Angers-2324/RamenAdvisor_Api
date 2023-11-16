import { Request, Response, query } from "express";
import HttpStatus from "../constants/HttpStatus";
import Foodtype from "../services/FoodtypeService";
import { TRequest } from "./types/types";
import AdminbMiddleware from "../middleware/AdminMiddleware";
import FoodtypeModel from "../models/FoodtypeModel";
import { ObjectId } from "mongodb";

const fs = require('fs');

// async function getAll(req: Request, res: Response){
//     try{
//         const result = await Foodtype.queryAllFoodtype();
//         // convert buffer to base64
//         let data: { _id: ObjectId; name: string; url: string; }[] = [];
//         result.forEach((foodtype) => {
//             foodtype.svg = foodtype.svg.toString('base64');
//             // print size of svg
//             console.log(foodtype.svg.length);
//             data.push({
//                 _id: foodtype._id,
//                 name: foodtype.name,
//                 url: `data:${foodtype.mimetype};base64,${foodtype.svg}`
//             });
//         });

//         res.status(HttpStatus.OK).json(data);
//     }catch(error){
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
//     } 
// }

async function getAllName(req: Request, res: Response){
    try{
        const result = await Foodtype.queryAllFoodtypeByName();
        
        res.status(HttpStatus.OK).json(result);
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    } 
}

async function getFoodtype(req: Request, res: Response){
    try{
        const result = await Foodtype.queryFoodtype(req.params.name);
        // convert result.svg type object to a buffer
        result.svg = result.svg.buffer;
        res.writeHead(200, {
            'Content-Type': result.mimetype,
            'Content-Length': result.svg.length,
            'X-Name': result.name,
            'Access-Control-Expose-Headers': 'X-Name'
        });
        res.end(result.svg, "binary");

    }catch(error){
        console.log(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal servers error"});
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
    getAllName,
    addFoodtype,
    getFoodtype
}