import express, { Router } from 'express';
import Moderator from "../controllers/ModeratorController"

const router: Router = express.Router();

router.get("/", Moderator.defaultFunction);


export default router;