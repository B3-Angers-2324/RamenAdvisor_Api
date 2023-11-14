import { Request, Response } from "express";
import Service from "../services/RestaurantService";
import HttpStatus from "../constants/HttpStatus";
import { ObjectId } from "mongodb";
import { TRequest } from "./types/types";
import OwnerMiddleware from "../middleware/OwnerMiddleware";

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
        res.status(HttpStatus.OK).json({
            number: restaurant.length,
            obj: restaurant
        });
    }catch(e){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
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

const createRestaurant = (req: TRequest, res: Response) => {
    OwnerMiddleware.ownerLoginMiddleware(req, res, async () => {
        try{
            req.body.ownerId = new ObjectId((req as any).token._id);
            req.body.note = 0;
            let restaurant = await Service.createRestaurant(req.body);
            res.status(HttpStatus.OK).json({id: restaurant.insertedId?.toString()});
        }catch(e){
            console.log(e)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
    });
}

const updateRestaurant = (req: Request, res: Response) => {
    OwnerMiddleware.ownerLoginMiddleware(req, res, async () => {
        try{
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