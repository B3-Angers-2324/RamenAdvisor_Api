import { Request, Response, query } from "express";
import { CustomError, TRequest } from "./types/types";
import MessageService from "../services/MessageService";
import ReportService from "../services/ReportService";
import HttpStatus from "../constants/HttpStatus";
import AdminMiddleware from "../middleware/AdminMiddleware";
import UserMiddleware from "../middleware/UserMiddleware";
import RestaurantService from "../services/RestaurantService";
import { ObjectId } from "mongodb";

const getMessagesForRestaurant = async (req: Request, res: Response) => {
    try{
        //Set the response type and the variable to store the messages
        let messages: {
            id: string;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                img: string;
            };
            content: string;
            date: Date;
            note: number;
            detailNote: {
                percentage: number;
                nbNote: number;
            }[];
        }[] = [];
        if (req.params.uid===undefined) throw new CustomError("No id provided", HttpStatus.BAD_REQUEST);
        //REtrieve the limit and offset from the query
        let limit = (req.query && req.query.limit) ? parseInt(req.query.limit.toString()) : 10;
        let offset = (req.query && req.query.offset) ? parseInt(req.query.offset.toString()) : 0;
        
        //Retrieve the messages from the database
        (await MessageService.queryMessagesForRestaurant(req.params.uid,limit+1,offset))?.forEach(element => {
            messages.push({
                id: element._id.toString(),
                user: {
                    id:element.user._id.toString(),
                    firstName: element.user.firstName,
                    lastName: element.user.lastName,
                    img: element.user.image
                },
                content: element.message,
                date: element.date,
                note: element.note,
                detailNote: element.detailNote
            });
        });
        //Check if there is more messages to load
        let pageleft = false;
        if (messages.length > limit){
            messages.pop();
            pageleft = true;
        }
        //Send the response
        res.status(HttpStatus.OK).json({
            number: messages.length,
            obj: messages,
            pageleft: pageleft
        });
    }catch(e: CustomError|any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message});
    }
};

const reportMessage = async (req: Request, res: Response) => {
    try{
        if (req.params.uid===undefined) throw new CustomError("No id provided", HttpStatus.BAD_REQUEST);
        if (req.body === undefined || req.body.userId===undefined || req.body.restaurantId===undefined || req.body.messageId===undefined) throw new CustomError("Missing field in body", HttpStatus.BAD_REQUEST);
        //Retrieve the report if it exists
        let report = await ReportService.getReportByMessageId(req.params.uid);
        //TODO: check that what the user sent in the body is correct
        // If not create a new one
        if (report === null) {
            //and add it to the database
            await ReportService.addReport({
                userId: req.body.userId,
                restaurantId: req.body.restaurantId,
                messageId: req.body.messageId,
                date_first: new Date(),
                nbReport: 1
            });
        }else{
            //If it exists, update the report
            report.nbReport++;
            await ReportService.updateReport(report);
        }
        //Send the response
        res.status(HttpStatus.OK).json({"message": "Report added"});
    }catch(e: CustomError|any){
        res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message});
    }
}

const getReportedMessages = async (req: Request, res: Response) => {
    AdminMiddleware.adminLoginMiddleware(req,res,async ()=>{
        try{
            //Retrieve the limit and offset from the query
            let limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
            let offset = req.query.offset ? parseInt(req.query.offset.toString()) : 0;
            //Retrieve the messages from the database
            let messages = await ReportService.queryReportedMessages(limit,offset);
            //Send the response
            res.status(HttpStatus.OK).json({
                number: messages?.length,
                obj: messages
            });
        }catch(e : Error|any){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
        }
    })
}

const deleteReport = async (req: Request, res: Response) => {
    AdminMiddleware.adminLoginMiddleware(req,res,async ()=>{
        try{
            if (req.params.uid===undefined) throw new CustomError("No id provided", HttpStatus.BAD_REQUEST);
            let reportid = req.params.uid;
            //check if the message as been rejected or not
            if (req.query.rejected===undefined){ throw new CustomError("No rejected parameter provided", HttpStatus.BAD_REQUEST);}
            let rejected = req.query.rejected==="true";
            //Retrieve the report
            let report = await ReportService.getReportById(reportid);
            //If the report is null throw an error
            if (report===null) throw new CustomError("Report not found", HttpStatus.NOT_FOUND);
            //If the message has been rejected remove the message from the database
            if (rejected){
                await MessageService.deleteMessage(report.messageId.toString());
            }
            //Remove the report from the database
            await ReportService.deleteReport(reportid);
            // return the response
            res.status(HttpStatus.OK).json({"message": "Report deleted"});
        }catch(e: CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message});
        }
    });
}

const addMessage = async (req: TRequest, res: Response) => {
    UserMiddleware.userLoginMiddleware(req,res,async ()=>{
        try{
            if (req.params.uid===undefined) throw new CustomError("No restaurant provided", HttpStatus.BAD_REQUEST);
            //check if the restaurant exists
            if (!(await RestaurantService.restaurantExistsById(req.params.uid))) throw new CustomError("Restaurant not found", HttpStatus.NOT_FOUND);
            //Check if the body is correct
            if (req.body === undefined || req.body.message===undefined || req.body.note===undefined) throw new CustomError("Missing field in body", HttpStatus.BAD_REQUEST);
            //Check if the user has already sent a message within the last 24h
            let lastMessage = await MessageService.lasTimeUserSentMessage(req.token._id,req.params.uid);
            if (lastMessage!==null && lastMessage!==undefined){
                let now = new Date();
                let diff = now.getTime() - lastMessage.date.getTime();
                let hours = diff / (1000 * 60 * 60);
                if (hours < 24) throw new CustomError("You can't send more than one message per day", HttpStatus.BAD_REQUEST);
            }
            //Create the message
            let message = {
                userId: new ObjectId(req.token._id),
                restaurantId: new ObjectId(req.params.uid),
                message: req.body.message,
                date: new Date(),
                note: parseInt(req.body.note)
            };
            //Add the message to the database
            await MessageService.addMessage(message);
            //Compute the new note percentage
            addNotePercentage(req.params.uid,parseInt(req.body.note));
            //Send the response
            res.status(HttpStatus.OK).json({"message": "Message added"});
        }catch(e: CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
    });
}

// refactor this function to juste update the note percentage and not add a new note
async function addNotePercentage(restaurantId : string , newNote : number){
    computeNotePercentage(restaurantId,newNote);
}

async function deleteNotePercentage(restaurantId : string , newNote : number){
    computeNotePercentage(restaurantId,newNote, -1);
}

async function computeNotePercentage(restaurantId : string , newNote : number, value : number = 1){
    try{        
        let restaurant = await RestaurantService.queryRestaurantById(restaurantId);
        if (restaurant===null || restaurant== undefined) throw new CustomError("Restaurant not found", HttpStatus.NOT_FOUND);
        //Add the new note to the total note
        restaurant.detailNote[newNote-1].nbNote += value;
        //Define variable to store the total note and the total percentage
        let nbNoteTotal = 0;
        let newPercentage : Array<{percentage: number; nbNote:number}> = [];
        //Retrieve the total number of note
        restaurant.detailNote.forEach((element :{percentage: number; nbNote:number}) => {
            nbNoteTotal += element.nbNote;
        });
        //Compute the new global note
        let newglobalnote = 0;
        restaurant.detailNote.forEach((element :{percentage: number; nbNote:number}, i :number) => {
            newglobalnote += (((i+1)*10) * element.nbNote);
        });
        newglobalnote = Math.round(newglobalnote / nbNoteTotal);
        //Update the global note
        //Compute the new percentage for each note
        restaurant.detailNote.forEach((element :{percentage: number; nbNote:number},i:number) => {
            newPercentage.push({"percentage": Math.round((element.nbNote / nbNoteTotal)*100), "nbNote": element.nbNote});
        });
        //update the restaurant in the database
        await RestaurantService.updateRestaurantNote(restaurant._id,newglobalnote,newPercentage);
    }catch(e){
        console.log("Error While computing the note : ",e);
    }
}

async function deleteMessage(req: Request, res: Response){
    //TODO: implement this function
}


export default {
    getMessagesForRestaurant,
    reportMessage,
    getReportedMessages,
    deleteReport,
    addMessage
};