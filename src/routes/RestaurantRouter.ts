import express, { Router } from 'express';
import Restaurant from "../controllers/RestaurantController";

const router: Router = express.Router();

router.get("/", Restaurant.defaultFunction);

router.get("/all", Restaurant.getAllRestaurants);

router.get("/best", Restaurant.getBestRestaurants);

router.get("/id/:uid", Restaurant.getRestaurantById);

router.post("/", Restaurant.createRestaurant);

router.put("/id/:uid", Restaurant.updateRestaurant);


export default router;