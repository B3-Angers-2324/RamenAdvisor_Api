import { Request, Response } from "express";
import Service from "../services/RestaurantService";
import HttpStatus from "../constants/HttpStatus";
import { ObjectId } from "mongodb";
import { CustomError, TRequest } from "./types/types";
import OwnerMiddleware from "../middleware/OwnerMiddleware";
import CheckInput from "../tools/CheckInput";

/**
 * Function to get the best restaurants in the database
 * @param req The request from the client
 * @param res The response to the client
 */
const getBestRestaurants = async (req: Request, res: Response) => {
    try{
        let restaurant: { 
            id: ObjectId;
            name: string;
            foodtype:string,
            note: number;
            position: any;
            images: string[]
        }[] = [];
        (await Service.queryBestRestaurants(parseInt(req.query.limit as string)))?.forEach((element) => {
            restaurant.push({
                id: element._id,
                name: element.name,
                foodtype: element.foodtype,
                note: element.note,
                position: element.position,
                images: element.images
            });
        });
        if (restaurant.length == 0){
            throw new CustomError("No restaurant found", HttpStatus.NOT_FOUND);
        }
        res.status(HttpStatus.OK).json({
            number: restaurant.length,
            obj: restaurant
        });
    }catch(e : CustomError|any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
    }
}

/**
 * Function to get one restaurant by its id
 * @param req The request from the client
 * @param res The response to the client
 */
const getRestaurantById = async (req: Request, res: Response) =>{
    try{
        if (req.params.uid === undefined) throw new CustomError("Missing parameters", HttpStatus.BAD_REQUEST);
        let restaurant = await Service.queryRestaurantById(req.params.uid);
        if (restaurant == undefined){
            throw new CustomError("No restaurant found", HttpStatus.NOT_FOUND);
        }
        res.status(HttpStatus.OK).json({
            obj: restaurant
        });
    }catch(e : CustomError|any){
        console.log(e.code);
        console.log(e);
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
    }
}

/**
 * Function to create a restaurant
 * @param req The request from the client
 * @param res The response to the client
 * @returns
*/
const createRestaurant = (req: TRequest, res: Response) => {
    OwnerMiddleware.ownerLoginMiddleware(req, res, async () => {
        try{
            if(!CheckInput.areNotEmpty([req.body.name, req.body.address, req.body.city, req.body.foodtype, req.body.position, req.body.handicap])){
                throw(new CustomError("Missing parameters", HttpStatus.BAD_REQUEST));
            }
            if(!CheckInput.phone(req.body.phone)){
                throw(new CustomError("Invalid phone number", HttpStatus.BAD_REQUEST));
            }
            req.body.ownerId = new ObjectId((req as any).token._id);
            req.body.note = 10;
            req.body.images = [
                "https://picsum.photos/1000/1000",
                "https://picsum.photos/1000/1000"
              ];
            let restaurant = await Service.createRestaurant(req.body);
            res.status(HttpStatus.OK).json({id: restaurant.insertedId?.toString()});
        }catch(e : CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
        });
}

/**
 * Function to update a restaurant
 * @param req The request from the client
 * @param res The response to the client
 * @returns
*/
const updateRestaurant = (req: Request, res: Response) => {
    OwnerMiddleware.ownerLoginMiddleware(req, res, async () => {
        try{
            if(!CheckInput.areNotEmpty([req.body.name, req.body.address, req.body.city, req.body.foodtype, req.body.position, req.body.handicap])){
                throw(new CustomError("Missing parameters", HttpStatus.BAD_REQUEST));
            }
            if(!CheckInput.phone(req.body.phone)){
                throw new CustomError("Invalid phone number", HttpStatus.BAD_REQUEST);
            }
            await Service.updateRestaurant(req.params.uid, req.body);
            res.status(HttpStatus.OK).json({"message": "Restaurant updated"});
        }catch(e : CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
    });
}

export default {
    getBestRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant
};