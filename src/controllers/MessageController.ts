import { Request, Response, query } from "express";
import { CustomError } from "./types/types";
import MessageService from "../services/MessageService";
import UserService from "../services/UserService";
import ReportService from "../services/ReportService";
import HttpStatus from "../constants/HttpStatus";
import AdminMiddleware from "../middleware/AdminMiddleware";

async function defaultFunction(req: Request, res: Response){
    res.status(HttpStatus.OK).json({"message": "Default message route"});
}

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
        //REtrieve the limit and offset from the query
        let limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
        let offset = req.query.offset ? parseInt(req.query.offset.toString()) : 0;
        //Retrieve the messages from the database
        let restaurant = await MessageService.queryMessagesForRestaurant(req.params.uid,limit,offset)
        //If the restaurant is undefined, throw an error
        if (restaurant === undefined) throw new Error("Restaurant not found");
        //For each message, retrieve the user information and add everything to the response
        await Promise.all(restaurant.map(async (element) => {
            let userInfo = await UserService.getOne(element.userId);
            //If there is no user throw an error
            if (userInfo === undefined || userInfo === null || userInfo._id===undefined) throw new Error("User not found");
            messages.push({
                id: element._id.toString(),
                user: {
                    id:userInfo._id.toString(),
                    firstName: userInfo.firstName, //JeanMarc DuPontavisMarin
                    lastName: userInfo.lastName,
                    img: userInfo.image
                },
                content: element.message,
                date: element.date,
                note: element.note
            });
        }))
        //Send the response
        res.status(HttpStatus.OK).json({
            number: messages.length,
            obj: messages
        });
    }catch(e){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
    }
};

const reportMessage = async (req: Request, res: Response) => {
    try{
        //Retrieve the report if it exists
        let report = await ReportService.getReportByMessageId(req.params.uid);
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
    }catch(e){
        console.log(e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({"message": "Internal server error"});
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
                number: messages.length,
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


export default {
    defaultFunction,
    getMessagesForRestaurant,
    reportMessage,
    getReportedMessages,
    deleteReport
};