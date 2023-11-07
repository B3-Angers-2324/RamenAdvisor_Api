import express, { Router } from 'express';
import Message from "../controllers/MessageController"

const router: Router = express.Router();

router.get("/", Message.defaultFunction);

router.get("/restaurant/:uid", Message.getMessagesForRestaurant);

export default router;