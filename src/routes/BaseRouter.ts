import express, { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import UserRouter from './UserRouter';
import AdminRouter from './AdminRouter';
import MessageRouter from './MessageRouter';
import RestaurantRouter from './RestaurantRouter';
import OwnerRouter from './OwnerRouter';
import ModeratorRouter from './ModeratorRouter';

const router: Router = express.Router();

router.use("/user", UserRouter);
router.use("/admin", AdminRouter);
router.use("/message", MessageRouter);
router.use("/restaurant", RestaurantRouter);
router.use("/owner", OwnerRouter)
router.use("/moderator", ModeratorRouter)


export default router;