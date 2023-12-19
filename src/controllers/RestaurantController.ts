import { Request, Response } from "express";
import Service from "../services/RestaurantService";
import HttpStatus from "../constants/HttpStatus";
import { ObjectId } from "mongodb";
import { CustomError, TRequest } from "./types/types";
import OwnerMiddleware from "../middleware/OwnerMiddleware";
import CheckInput from "../tools/CheckInput";
import ImageContoller from "./ImageContoller";
import MessageService from "../services/MessageService";

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
                note: 0,
                images: [],
                detailNote: [{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0},{"percentage": 0, "nbNote": 0}]
            }
            
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
        if ((e as Error).message=="No restaurants found"){
            res.status(HttpStatus.NOT_FOUND).json({"message": "No restaurants found"});
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
    }
}

const updateRestaurantImage = async (req: TRequest, res: Response) => {
    OwnerMiddleware.ownerLoginMiddleware(req, res, async () => {
        try{
            if(req.file){
                // check if its image
                if(!CheckInput.isImage(req.file.mimetype)){
                    throw new CustomError("Image must be a jpg, png, jpeg or gif", HttpStatus.BAD_REQUEST);
                }

                // check if image is under 15Mo
                if(!CheckInput.isUnder15Mo(req.file.size)){
                    throw new CustomError("Image must be under 15Mo", HttpStatus.BAD_REQUEST);
                }

                // check if the restaurant already has images as this place
                const restaurant = await Service.queryRestaurantById(req.params.uid);
                if(!restaurant) throw new CustomError("Restaurant not found", HttpStatus.NOT_FOUND);
                
                let alreadyHasImage = false;
                // check if the image already exists
                if(restaurant.images[req.params.imageNb] != "" && restaurant.images[req.params.imageNb] != undefined){
                    // delete the old image
                    await ImageContoller.deleteImage(restaurant.images[req.params.imageNb]);
                    alreadyHasImage = true;
                }

                // add the new image
                const imageId = await ImageContoller.addImage(req.file.buffer, req.file.mimetype);

                // update the restaurant
                await Service.updateRestaurantImage(req.params.uid, req.params.imageNb, imageId, alreadyHasImage);
                res.status(HttpStatus.OK).json({"message": "Image updated"});
            }else{
                throw new CustomError("Missing parameters", HttpStatus.BAD_REQUEST);
            }
        }catch(e : CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
    });
}

const deleteRestaurant = async (req: TRequest, res: Response) => {
    OwnerMiddleware.ownerLoginMiddleware(req, res, async () => {
        try{
            //check if restaurant exists
            const restaurant = await Service.queryRestaurantById(req.params.uid);
            if(!restaurant) throw new CustomError("Restaurant not found", HttpStatus.NOT_FOUND);
            // if there is more than zero images
            if(restaurant.images.length > 0){
                // delete all images
                for(let i = 0; i < restaurant.images.length; i++){
                    if(restaurant.images[i] != "" && restaurant.images[i] != undefined){
                        await ImageContoller.deleteImage(restaurant.images[i]);
                    }
                }
            }

            //delete all messages
            await MessageService.deleteAllMessagesForRestaurant(req.params.uid);
            await Service.deleteRestaurant(req.params.uid);
            res.status(HttpStatus.OK).json({"message": "Restaurant deleted"});
        }catch(e : CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
    });

}

export default {
    getBestRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    getRestaurantSearch,
    updateRestaurantImage,
    deleteRestaurant
};