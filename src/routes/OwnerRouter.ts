import express, { Router } from 'express';
import Owner from "../controllers/OwnerController"

const router: Router = express.Router();

router.get("/", Owner.defaultFunction);


export default router;