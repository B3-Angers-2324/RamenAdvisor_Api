import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";

function nothing(req: Request, res: Response) {}

export default {
    nothing,
};