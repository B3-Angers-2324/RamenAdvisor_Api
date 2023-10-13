import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";

const defaultFunction = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({"message": "Default moderator route"});
}


export default {
    defaultFunction
};