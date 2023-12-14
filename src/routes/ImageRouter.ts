import express, { Router } from 'express';
import ImageContoller from '../controllers/ImageContoller';
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router: Router = express.Router();


router.get("/:id", ImageContoller.getImage);

router.options("/:id", (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Name');
    res.sendStatus(200);
});

export default router;