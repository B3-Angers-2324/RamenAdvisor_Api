import express, { Router } from 'express';
import Foodtype from "../controllers/FoodtypeController"
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router: Router = express.Router();

router.get("/", Foodtype.getAllName);

router.get("/:name", Foodtype.getFoodtype);

router.options("/:name", (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Name');
    res.sendStatus(200);
});

router.post("/", upload.single('image'), Foodtype.addFoodtype);

export default router;