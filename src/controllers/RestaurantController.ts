import { Request, Response } from "express";
import Service from "../services/RestaurantService";
import HttpStatus from "../constants/HttpStatus";
import { ObjectId } from "mongodb";
import { cp } from "fs";

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
const getBestRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurants = await Service.queryBestRestaurants(parseInt(req.query.limit as string));
        const restaurantList = restaurants.map((element) => ({
            id: element._id,
            name: element.name,
            foodtype: element.foodtype,
            note: element.note,
            position: element.position,
            images: element.images
        }));
        res.status(HttpStatus.OK).json({
            number: restaurantList.length,
            obj: restaurantList
        });
    } catch (e) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

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

const getRestaurantSearch = async (req: Request, res: Response) => {
    try{
        let restaurant: { 
            id: ObjectId;
            name: string;
            foodtype:string,
            note: number;
            position: any;
            images: string[]
        }[] = [];
        //Retrive all the query parameters
        let type = (req.query.type!="none")?req.query.type as string:undefined;
        let accessible = (req.query.accessible as string == "true"); //Convert the string to boolean
        let limit = parseInt(req.query.limit as string); 
        let search = (req.query.search)?req.query.search as string : undefined;
        //Check if the mandatory parameters are valid
        if (limit==undefined || accessible==undefined){
            throw new Error("Invalid parameters");
        }
        (await Service.queryRestaurantsWithParam(type, accessible, limit, search)).forEach((element) => {
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
    }catch(e ){
        if ((e as Error).message=="No restaurants found"){
            res.status(HttpStatus.NOT_FOUND).json({"message": "No restaurants found"});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
    }
}

export default {
    defaultFunction,
    getAllRestaurants,
    getBestRestaurants,
    getRestaurantById,
    getRestaurantSearch
};