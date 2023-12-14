import express, { Router } from 'express';
import Foodtype from "../controllers/FoodtypeController"
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router: Router = express.Router();

router.get("/", Foodtype.getAll);

router.delete("/:id", Foodtype.deleteFoodtype);

router.post("/", upload.single('image'), Foodtype.addFoodtype);

export default router;