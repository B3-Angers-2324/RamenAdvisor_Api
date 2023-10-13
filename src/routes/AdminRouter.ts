import express, { Router } from 'express';
import adminMiddleware from '../middleware/AdminMiddleware';
import Admin from "../controllers/AdminController"

const router: Router = express.Router();

router.get("/login", Admin.login);

// load middleware for all routes to test admin login
router.use(adminMiddleware.adminLoginMiddleware);


router.get("/", Admin.defaultFunction);


export default router;