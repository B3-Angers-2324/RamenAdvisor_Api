import express, { Router } from 'express';
import UserMiddleware from '../middleware/UserMiddleware';
import User from "../controllers/UserController"

const router: Router = express.Router();

router.get("/login", User.login);

// load middleware for all routes to test user login
router.use(UserMiddleware.userLoginMiddleware);

router.get("/", User.getAll);

router.get("/otherRoute", User.defaultFunction);


export default router;