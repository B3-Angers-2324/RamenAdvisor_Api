import { Request, Response, query } from "express";
import Service from "../services/MessageService";
import UserService from "../services/UserService";
import ReportService from "../services/ReportService";
import HttpStatus from "../constants/HttpStatus";

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
        let restaurant = await Service.queryMessagesForRestaurant(req.params.uid,limit,offset)
        //If the restaurant is undefined, throw an error
        if (restaurant === undefined) throw new Error("Restaurant not found");
        //For each message, retrieve the user information and add everything to the response
        await Promise.all(restaurant.map(async (element) => {
            let userInfo = await UserService.getOne(element.userId);
            //If there is no user throw an error
            if (userInfo === undefined || userInfo === null || userInfo.id===undefined) throw new Error("User not found");
            messages.push({
                id: element._id.toString(),
                user: {
                    id:userInfo.id.toString(),
                    firstName: userInfo.firstName, //JeanMarc DuPontavisMarin
                    lastName: userInfo.lastName,
                    img: "http://thispersondoesnotexist.com/"
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


export default {
    defaultFunction,
    getMessagesForRestaurant,
    reportMessage
};