import express, { Router } from 'express';
import adminMiddleware from '../middleware/AdminMiddleware';
import Admin from "../controllers/AdminController"

const router: Router = express.Router();

router.post("/login", Admin.login);

// load middleware for all routes to test admin login
router.use(adminMiddleware.adminLoginMiddleware);

router.get("/users", (req, res)=> {
    console.log("HERE");
    res.send("users");
});

export default router;