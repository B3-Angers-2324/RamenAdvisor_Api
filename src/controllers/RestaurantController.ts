import { Request, Response } from "express";
import Service from "../services/RestaurantService";
import HttpStatus from "../constants/HttpStatus";
import { ObjectId } from "mongodb";
import { TRequest } from "./types/types";
import OwnerMiddleware from "../middleware/OwnerMiddleware";
import CheckInput from "../tools/CheckInput";

const defaultFunction = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({"message": "Default restaurant route"});
}

const getAllRestaurants = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({"message": "Get all restaurants"});
}

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
        (await Service.queryBestRestaurants(parseInt(req.query.limit as string))).forEach((element) => {
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
            throw new Error("No restaurant found");
        }
        res.status(HttpStatus.OK).json({
            number: restaurant.length,
            obj: restaurant
        });
    }catch(e : Error|any){
        if (e.message == "No restaurant found") res.status(HttpStatus.NOT_FOUND).json({"message": "No restaurant found"});
        else res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    }
}

/**
 * Function to get one restaurant by its id
 * @param req The request from the client
 * @param res The response to the client
 */
const getRestaurantById = async (req: Request, res: Response) =>{
    try{
        let restaurant = await Service.queryRestaurantById(req.params.uid);
        res.status(HttpStatus.OK).json({
            obj: restaurant
        });
    }catch(e){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
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
                res.status(HttpStatus.BAD_REQUEST).json({"message": "Missing parameters"});
                return;
            }
            if(CheckInput.phone(req.body.phone) == null){
                res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid phone number"});
                return;
            }
            req.body.ownerId = new ObjectId((req as any).token._id);
            req.body.note = 10;
            req.body.images = [
                "https://picsum.photos/1000/1000",
                "https://picsum.photos/1000/1000"
              ];
            let restaurant = await Service.createRestaurant(req.body);
            res.status(HttpStatus.OK).json({id: restaurant.insertedId?.toString()});
        }catch(e){
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
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
                res.status(HttpStatus.BAD_REQUEST).json({"message": "Missing parameters"});
                return;
            }
            if(CheckInput.phone(req.body.phone) == null){
                res.status(HttpStatus.BAD_REQUEST).json({"message": "Invalid phone number"});
                return;
            }
            let restaurant = await Service.updateRestaurant(req.params.uid, req.body);
            res.status(HttpStatus.OK).json({"message": "Restaurant updated"});
        }catch(e){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
    });
}

export default {
    defaultFunction,
    getAllRestaurants,
    getBestRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant
};