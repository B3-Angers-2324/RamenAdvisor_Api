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
};

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
            if(req.body.tel != "" && !CheckInput.phone(req.body.tel)){
                throw(new CustomError("Invalid phone number", HttpStatus.BAD_REQUEST));
            }
            let restaurantData = {
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                tel: req.body.tel,
                foodtype: req.body.foodtype,
                position: req.body.position,
                handicap: req.body.handicap,
                ownerId: new ObjectId(req.token._id),
                note: 10,
                images: [
                    "https://picsum.photos/1000/1000",
                    "https://picsum.photos/1000/1000"
                ],
                detailNote: [{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0}]
            }
            // req.body.ownerId = new ObjectId((req as any).token._id);
            // req.body.note = 10;
            // req.body.images = [
            //     "https://picsum.photos/1000/1000",
            //     "https://picsum.photos/1000/1000"
            // ];
            // req.body.detailNote = [{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0}];
            let restaurant = await Service.createRestaurant(restaurantData);
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
            if(req.body.tel != "" && !CheckInput.phone(req.body.tel)){
                throw new CustomError("Invalid phone number", HttpStatus.BAD_REQUEST);
            }
            await Service.updateRestaurant(req.params.uid, req.body);
            res.status(HttpStatus.OK).json({"message": "Restaurant updated"});
        }catch(e : CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
    });
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
        console.log(e);
        if ((e as Error).message=="No restaurants found"){
            res.status(HttpStatus.NOT_FOUND).json({"message": "No restaurants found"});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
    }
}

export default {
    getBestRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    getRestaurantSearch
};