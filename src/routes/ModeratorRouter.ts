import express, { Router } from 'express';
import Moderator from "../controllers/ModeratorController"

const router: Router = express.Router();

router.get("/validate", Moderator.getOwnerNoValidate);

router.get("/getAll", Moderator.getAllOwner);


export default router;