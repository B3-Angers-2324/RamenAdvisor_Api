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
                note: element.note
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
            //Check if the user has already sent a message within the last 24h
            let lastMessage = await MessageService.lasTimeUserSentMessage(req.token._id,req.params.uid);
            if (lastMessage!==null && lastMessage!==undefined){
                let now = new Date();
                let diff = now.getTime() - lastMessage.date.getTime();
                let hours = diff / (1000 * 60 * 60);
                if (hours < 24) throw new CustomError("You can't send more than one message per day", HttpStatus.BAD_REQUEST);
            }
            if (req.body === undefined || req.body.message===undefined || req.body.note===undefined) throw new CustomError("Missing field in body", HttpStatus.BAD_REQUEST);
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
            //Send the response
            res.status(HttpStatus.OK).json({"message": "Message added"});
        }catch(e: CustomError|any){
            res.status(e.code? e.code : HttpStatus.INTERNAL_SERVER_ERROR).json({"message": e.message? e.message : "Internal server error"});
        }
    });
}


export default {
    getMessagesForRestaurant,
    reportMessage,
    getReportedMessages,
    deleteReport,
    addMessage
};