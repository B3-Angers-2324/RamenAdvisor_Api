import express, { Router } from 'express';
import Message from "../controllers/MessageController"

const router: Router = express.Router();

router.get("/", Message.defaultFunction);


export default router;