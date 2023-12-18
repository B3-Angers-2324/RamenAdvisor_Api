import express, { Router } from 'express';
import adminMiddleware from '../middleware/AdminMiddleware';
import Admin from "../controllers/AdminController"

const router: Router = express.Router();

router.post("/login", Admin.login);

// load middleware for all routes to test admin login
router.use(adminMiddleware.adminLoginMiddleware);

router.get("/getValidate", Admin.getOwnerNoValidate);

router.get("/allOwner", Admin.getAllOwner);

router.patch("/validate/:uid", Admin.validateOwner);

router.get("/owner/profile/:uid", Admin.getOwnerProfile);

router.get("/restaurants/:uid", Admin.getRestaurantsByOwner);


export default router;