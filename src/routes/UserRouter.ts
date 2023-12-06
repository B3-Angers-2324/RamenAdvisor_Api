import express, { Router } from 'express';
import UserMiddleware from '../middleware/UserMiddleware';
import UserController from "../controllers/UserController"

const router: Router = express.Router();

router.post("/login", UserController.login);

router.post("/register", UserController.register);

// load middleware for all routes to test user login
router.use(UserMiddleware.userLoginMiddleware);

router.get("/profile", UserController.getUserProfile);

router.get("/message", UserController.getUserMessage);

router.patch("/profile", UserController.updateUserProfile);

router.delete("/profile", UserController.deleteUserProfile);




export default router;