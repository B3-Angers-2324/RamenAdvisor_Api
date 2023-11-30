import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import OwnerService from "../services/OwnerService";
import { TRequest } from "./types/types";


function nothing() {}

async function getOwnerNoValidate (req: TRequest, res: Response) {
    try{
        let owners = await OwnerService.queryOwnerNoValidate();
        if(owners){
            res.status(HttpStatus.OK).json({"owners": owners});
        }else{
            res.status(HttpStatus.NOT_FOUND).json({"message": "No unvalidate owners found"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Error while getting owners"});
    }
} 

export default {
    nothing,
    getOwnerNoValidate
};