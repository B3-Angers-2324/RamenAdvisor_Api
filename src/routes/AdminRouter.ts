import express, { Router } from 'express';
import adminMiddleware from '../middleware/AdminMiddleware';
import Admin from "../controllers/AdminController"

const router: Router = express.Router();

router.post("/login", Admin.login);

// load middleware for all routes to test admin login
router.use(adminMiddleware.adminLoginMiddleware);

router.get("/getValidate", Admin.getOwnerNoValidate);

router.get("/getAll", Admin.getAllOwner);

router.get("/getOne", Admin.getOwnerProfile);

router.patch("/validate", Admin.validateOwner);

router.get("/restaurants", Admin.getRestaurantsByOwner);


export default router;