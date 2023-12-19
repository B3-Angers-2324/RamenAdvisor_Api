import express, { Router } from 'express';
import Restaurant from "../controllers/RestaurantController";
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router: Router = express.Router();

router.get("/best", Restaurant.getBestRestaurants);

router.get("/id/:uid", Restaurant.getRestaurantById);

router.post("/", Restaurant.createRestaurant);

router.put("/id/:uid", Restaurant.updateRestaurant);

router.get("/search", Restaurant.getRestaurantSearch);

router.patch("/id/:uid/:imageNb", upload.single('image'), Restaurant.updateRestaurantImage);

router.delete("/id/:uid", Restaurant.deleteRestaurant);


export default router;