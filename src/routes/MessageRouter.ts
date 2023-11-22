import express, { Router } from 'express';
import Message from "../controllers/MessageController"

const router: Router = express.Router();

router.get("/all/restaurant/:uid", Message.getMessagesForRestaurant);

router.put("/report/:uid", Message.reportMessage);

router.get("/reported/", Message.getReportedMessages);

router.delete("/report/:uid", Message.deleteReport);

router.post("/new/restaurant/:uid", Message.addMessage)

export default router;