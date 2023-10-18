import { Request, Response } from "express";
import Service from "../services/RestaurantService";
import HttpStatus from "../constants/HttpStatus";
import { ObjectId } from "mongodb";

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
    console.log(req.query.limit);
    try{
        let restaurant: { 
            id: ObjectId;
            name: string;
            address: string;
            foodtype:string,
            note: number;
            position: any;
            image:string
        }[] = [];
        (await Service.queryBestRestaurants(parseInt(req.query.limit as string))).forEach((element) => {
            restaurant.push({
                id: element._id,
                name: element.name,
                address: element.address,
                foodtype: element.foodtype,
                note: element.note,
                position: element.position,
                image: "https://random.imagecdn.app/200/200"
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


export default {
    defaultFunction,
    getAllRestaurants,
    getBestRestaurants
};