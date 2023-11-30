import { Request, Response } from "express";
import HttpStatus from "../constants/HttpStatus";
import OwnerServices from "../services/OwnerService";
import Owner from "../models/OwnerModel";
import { TRequest } from "./types/types";
import CheckInput from "../tools/CheckInput";


function nothing() {}

export default {
    nothing
};