import express, { Router } from 'express';
import adminMiddleware from '../middleware/AdminMiddleware';
import Admin from "../controllers/AdminController"
import HttpStatus from '../constants/HttpStatus';
import { TRequest } from '../controllers/types/types';

const router: Router = express.Router();

router.post("/login", Admin.login);

// load middleware for all routes to test admin login
router.use(adminMiddleware.adminLoginMiddleware);

router.get("/getValidate", Admin.getOwnerNoValidate);

router.get("/allOwner", Admin.getAllOwner);

router.patch("/validate/:uid", Admin.validateOwner);

router.get("/owner/profile/:uid", Admin.getOwnerProfile);

router.get("/restaurants/:uid", Admin.getRestaurantsByOwner);

router.patch("/ban/:uid", Admin.banOwner);

router.get("/nav", Admin.nav);

router.get("/search/user", Admin.getUsers);

router.get("/user/profile/:uid", Admin.getUserProfile);

router.get("/user/message/:uid", Admin.getUserMessage);

router.patch("/user/ban/:uid", Admin.banUser);


// Route for admin only

router.get("/moderator", Admin.getModerators);

router.post("/moderator", Admin.addModerator);

router.delete("/moderator/:mid", Admin.deleteModerator);


export default router;