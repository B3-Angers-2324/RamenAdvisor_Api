import express, { Router } from 'express';
import Restaurant from "../controllers/RestaurantController";

const router: Router = express.Router();

router.get("/", Restaurant.defaultFunction);


export default router;