import express, { Router } from 'express';
import UserMiddleware from '../middleware/UserMiddleware';
import User from "../controllers/UserController"

const router: Router = express.Router();

router.post("/login", User.login);

router.post("/register", User.register);

// load middleware for all routes to test user login
router.use(UserMiddleware.userLoginMiddleware);

router.get("/", User.getAll);

router.get("/profile", User.getUserProfile);

router.patch("/profile", User.updateUserProfile);

router.delete("/profile", User.deleteUserProfile);


export default router;