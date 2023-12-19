import { Request, Response, query } from "express";
import HttpStatus from "../constants/HttpStatus";
import { TRequest } from "./types/types";
import ImageService from "../services/ImageService";
import sharp from "sharp";


async function getImage(req: Request, res: Response){
    try{
        const result = await ImageService.queryImage(req.params.id);
        if (result) {
            result.binary = result.binary.buffer;
            res.writeHead(200, {
                'Content-Type': result.mimetype,
                'Content-Length': result.binary.length,
                'X-Name': "foodtype_icon",
                'Access-Control-Expose-Headers': 'X-Name'
            });
            res.end(result.binary, "binary");
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal servers error"});
        }
    }catch(error){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal servers error"});
    }
}

async function convertToWebp(buffer: Buffer) : Promise<Buffer> {
    // convert image to webp format
    const quality = 30; // 0-100 (worst-best)
    const result = await sharp(buffer).webp({ quality: quality }).toBuffer();
    return result;
}

async function addImage(binary: Buffer, mimetype: string) : Promise<string> {
    let webpBuffer = binary;
    if(mimetype!="image/webp" && mimetype!="image/svg+xml"){
        // convert image to webp
        webpBuffer = await convertToWebp(binary);
    }

    // add image to database
    const image = {
        binary: webpBuffer,
        mimetype: mimetype
    }
    const imageResult = await ImageService.addImage(image);
    if(imageResult==undefined){
        throw new Error("Internal server error");
    }
    return imageResult.insertedId.toString();
}

async function deleteImage(imageId: string) : Promise<boolean> {
    const result = await ImageService.deleteImage(imageId);
    if(result==undefined){
        throw new Error("Internal server error");
    }
    return true;
}

export default {
    getImage,
    addImage,
    deleteImage,
} as const;