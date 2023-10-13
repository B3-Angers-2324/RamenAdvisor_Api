import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";

const defaultFunction = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({"message": "Default owner route"});
}


export default {
    defaultFunction
};